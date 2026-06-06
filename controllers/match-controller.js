const db = require('../models');

const createMatch = async (req, res) => {
  try {
    const{ Date, Time, CourtId, DegreeId, MatchType} = req.body;
    if (!Date || !Time || !CourtId || !DegreeId || MatchType === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const match = await db.Match.create({
      Date,
      time:Time,
      CourtId,
      DegreeId,
      MatchType
    });
    return res.status(201).json(match);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getMatches = async (req, res) => {
  try {
    const matches = await db.Match.findAll();
    return res.status(200).json(matches);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getOneMatch = async (req, res) => {
  try {
    const match = await db.Match.findByPk(req.params.id);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    return res.status(200).json(match);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const deleteMatch = async (req, res) => {
  try {
    const match = await db.Match.findByPk(req.params.id); 
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    await match.destroy();
    return res.status(200).json({ message: 'Match deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getMatchDetails = async (req, res) => {
  try {
    const { MatchId } = req.params;
    const match = await db.Match.findByPk(MatchId, {
      include: [
        {
          model: db.LineUp,
          include: [
            {
              model: db.Team,
              attributes: ['id', 'TeamName', 'TeamManager'],
            },
          ],
        },
        {
          model: db.MatchReport,
        },
        {
          model: db.Event,
          include: [
            {
              model: db.TypeOfEvent,
              attributes: ['id', 'EventName'],
            },
            {
              model: db.Player,
              attributes: ['id', 'Name', 'Number'],
            },
            {
              model: db.Team,
              attributes: ['id', 'TeamName', 'TeamManager'],
            },
          ],
        },
        {
          model: db.Team,
          attributes: ['id', 'TeamName', 'TeamManager'],
          through: { attributes: [] },
        },
      ],
      order: [[db.Event, 'Time', 'ASC']],
    });

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    const response = {
      match: {
        id: match.id,
        Date: match.Date,
        time: match.time,
        MatchType: match.MatchType,
        CourtId: match.CourtId,
        DegreeId: match.DegreeId,
      },
      teams: match.Teams || [],
      lineUps: (match.LineUps || []).map(lineUp => ({
        id: lineUp.id,
        ParticipatingPlayers: lineUp.ParticipatingPlayers,
        substitutePlayers: lineUp.substitutePlayers,
        kitColor: lineUp.kitColor,
        shortColor: lineUp.shortColor,
        socksColor: lineUp.socksColor,
        Team: lineUp.Team || null,
      })),
      matchReport: match.MatchReport || null,
      events: (match.Events || []).map(event => ({
        id: event.id,
        Time: event.Time,
        Description: event.Description,
        TypeOfEvent: event.TypeOfEvent || null,
        Player: event.Player || null,
        Team: event.Team || null,
      })),
    };

    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createMatch,
  getMatches,
  getOneMatch,
  deleteMatch,
  getMatchDetails,
};
