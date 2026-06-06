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

module.exports = {
  createMatch,
  getMatches,
  getOneMatch,
  deleteMatch
};
