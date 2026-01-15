/**
 * Middleware: notConfinedInWAT
 * Expects in req.body: { userId/userId, date/Date, time/Time }
 * - If a Match exists in WAT table for the same court and date within ±2 hours of the given time,
 *   respond 400 with message: "this court in this time is confined"
 * - Otherwise call next()
 */

const db = require('../models');
const { Op } = require('sequelize');
const { WAT, Sequelize } = db;

async function checkTimeInWAT(req, res, next) {
  try {
    const{MatchId,UserId}=req.body;
    const getMatch = await db.Match.findByPk(MatchId)
    // Accept either lowercase or capitalized keys
    let userId = req.body.UserId;
    let date = getMatch.Date;
    let time = getMatch.time;

    if (!userId || !date || !time) {
      return res.status(400).json({ message: 'userId/userId, date/Date and time/Time are required' });
    }

    // validate userId
    const id = Number(userId);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: 'userId must be a positive integer' });
    }

    // validate date (expect YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) {
      return res.status(400).json({ message: 'date must be in YYYY-MM-DD format' });
    }

    function parseTimeToSeconds(t) {
      const parts = String(t).split(':').map(p => Number(p));
      if (parts.length < 2 || parts.length > 3 || parts.some(p => Number.isNaN(p))) return null;
      const [hh, mm, ss = 0] = parts;
      if (hh < 0 || hh > 23 || mm < 0 || mm > 59 || ss < 0 || ss > 59) return null;
      return hh * 3600 + mm * 60 + ss;
    }

    function formatSecondsToTime(s) {
      const hh = Math.floor(s / 3600) % 24;
      const mm = Math.floor((s % 3600) / 60);
      const ss = s % 60;
      return [hh, mm, ss].map(v => String(v).padStart(2, '0')).join(':');
    }

    function addDays(dateStr, delta) {
      const [y, m, d] = dateStr.split('-').map(n => Number(n));
      const dt = new Date(y, m - 1, d);
      dt.setDate(dt.getDate() + delta);
      const yy = dt.getFullYear();
      const mm = String(dt.getMonth() + 1).padStart(2, '0');
      const dd = String(dt.getDate()).padStart(2, '0');
      return `${yy}-${mm}-${dd}`;
    }

    const seconds = parseTimeToSeconds(time);
    if (seconds === null) {
      return res.status(400).json({ message: 'time must be in HH:mm or HH:mm:ss format' });
    }

    const TWO_HOURS = 2 * 3600;
    const startSec = seconds - TWO_HOURS;
    const endSec = seconds + TWO_HOURS;

    const checkRange = async (dateStr, startS, endS) => {
      const startTimeStr = formatSecondsToTime(startS);
      const endTimeStr = formatSecondsToTime(endS);
      const conditions = [
        { UserId: id },
        Sequelize.where(Sequelize.fn('DATE', Sequelize.col('Date')), dateStr),
        { time: { [Op.between]: [startTimeStr, endTimeStr] } }
      ];
      return WAT.findOne({ where: { [Op.and]: conditions } });
    };

    // Range within same day
    if (startSec >= 0 && endSec < 86400) {
      if (await checkRange(date, startSec, endSec)) {
        return res.status(400).json({ message: 'this user has a workout or test in same a date and time for match' });
      }
    } else {
      // Spans previous day
      if (startSec < 0) {
        const prevStart = startSec + 86400;
        const prevDate = addDays(date, -1);
        if (await checkRange(prevDate, prevStart, 86399)) {
          return res.status(400).json({ message: 'this user has a workout or test in same a date and time for match' });
        }
        if (await checkRange(date, 0, endSec)) {
          return res.status(400).json({ message: 'this user has a workout or test in same a date and time for match' });
        }
      }
      // Spans next day
      if (endSec >= 86400) {
        const nextEnd = endSec - 86400;
        const nextDate = addDays(date, 1);
        if (await checkRange(date, startSec, 86399)) {
          return res.status(400).json({ message: 'this user has a workout or test in same a date and time for match' });
        }
        if (await checkRange(nextDate, 0, nextEnd)) {
          return res.status(400).json({ message: 'this user has a workout or test in same a date and time for match' });
        }
      }
    }

    // No conflicts found
    return next();
  } catch (err) {
    console.error('notConfinedInWAT middleware error:', err);
    return res.status(500).json({ message: 'Server error while checking WAT confinement' });
  }
}

module.exports = checkTimeInWAT;
