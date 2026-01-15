const db = require('../models');

const createMatch = async (req, res) => {
  try {
    const{ Date, Time, CourtId, DegreeId, MatchType} = req.body;
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







            /*
module.exports = {
  getTeams: async (req, res) => {
    const { id } = req.params;
    try {
      const match = await db.Match.findByPk(id, { include: db.Team });
      if (!match) return res.status(404).json({ message: 'Match not found' });
      return res.json(match.Teams);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  addTeams: async (req, res) => {
    const { id } = req.params;
    const { teamIds } = req.body; // array or single id
    try {
      const match = await db.Match.findByPk(id);
      if (!match) return res.status(404).json({ message: 'Match not found' });
      const ids = Array.isArray(teamIds) ? teamIds : [teamIds];
      await match.addTeams(ids);
      const teams = await match.getTeams();
      return res.json(teams);
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ message: 'Duplicate pairing' });
      }
      return res.status(500).json({ message: err.message });
    }
  },

  removeTeam: async (req, res) => {
    const { id, teamId } = req.params;
    try {
      const match = await db.Match.findByPk(id);
      if (!match) return res.status(404).json({ message: 'Match not found' });
      await match.removeTeam(teamId);
      return res.json({ message: 'Team removed' });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  setTeams: async (req, res) => {
    const { id } = req.params;
    const { teamIds } = req.body;
    try {
      const match = await db.Match.findByPk(id);
      if (!match) return res.status(404).json({ message: 'Match not found' });
      const ids = Array.isArray(teamIds) ? teamIds : [teamIds];
      await match.setTeams(ids);
      const teams = await match.getTeams();
      return res.json(teams);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
};*/