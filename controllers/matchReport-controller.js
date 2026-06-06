const db = require('../models');

const createMatchReport = async (req, res) => {
    try {
        const { Round, FHResult, SHResult, FinalResult , MatchId } = req.body;
            // Validate required fields
        if (!Round || !FHResult || !SHResult || !FinalResult || !MatchId) {
            return res.status(400).json({ error: 'All fields are required.' });
        }
        // Check if the match exists
        const match = await db.Match.findByPk(MatchId);
        if (!match) {
            return res.status(404).json({ error: 'Match not found.' });
        }
        const matchReport = await db.MatchReport.create({ 
            Round,
            FHResult,
            SHResult,
            FinalResult,
            MatchId
         });
        res.status(201).json(matchReport);
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMatchReport = async (req, res) => {
    try {
        const matchReport = await db.MatchReport.findByPk(req.params.id);
        if (!matchReport) {
            return res.status(404).json({ error: 'Match report not found.' });
        }

        return res.status(200).json(matchReport);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMatchReportOfMatch = async (req, res) => {
    try {
        const matchReport = await db.MatchReport.findOne({ where: { MatchId: req.params.MatchId } });
        if (!matchReport) {
            return res.status(404).json({ error: 'Match report not found for this match.' });
        }
        return res.status(200).json(matchReport);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateMatchReport = async (req, res) => {
    try {
        const { Round, FHResult, SHResult, FinalResult } = req.body; 
        const matchReport = await db.MatchReport.findByPk(req.params.id);
        if (!matchReport) {
            return res.status(404).json({ error: 'Match report not found.' });
        }
        await matchReport.update({ Round, FHResult, SHResult, FinalResult });
        return res.status(200).json(matchReport);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteMatchReport = async (req, res) => {
    try {
        const matchReport = await db.MatchReport.findByPk(req.params.id);
        if (!matchReport) {
            return res.status(404).json({ error: 'Match report not found.' });
        }
        await matchReport.destroy();
        return res.status(200).json({ message: 'Match report deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createMatchReport,
    getMatchReport,
    getMatchReportOfMatch,
    updateMatchReport,
    deleteMatchReport
};
