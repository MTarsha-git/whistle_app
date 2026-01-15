const db = require('../models');

const addTeamTOMatch = async (req, res) => {
    try {
        const { MatchId, TeamId } = req.body;
        if (!MatchId || !TeamId) {
            return res.status(400).send({ message: 'MatchId and TeamId are required' });
        }
        // Check if Match exists
        const matchCreated = await db.Match.findByPk(MatchId);
        if (!matchCreated) {
            return res.status(404).send({ message: 'Match not found' });
        }
        // Check if Match already has two teams
        const isFull = await db.MatchTeams.count({ where: { MatchId } });
        if (isFull >= 2) {
            return res.status(400).send({ message: 'Match already has two teams assigned' });
        }
        // Check Degree compatibility
        const DegreeOfTeam = await db.Team.findByPk(TeamId, { attributes: ['DegreeId'] });
        const DegreeOfMatch = await db.Match.findByPk(MatchId,{attributes: ['DegreeId']});
        if (DegreeOfTeam.DegreeId != DegreeOfMatch.DegreeId) {
            return res.status(400).send({ message: 'Incompatible Degree' });
        }
        // Check if Team already has a match on the same date
        const DateOfMatch = await db.Match.findByPk(MatchId, { attributes: ['Date'] });
        const matchesOnSameDate = await db.Match.findAll({
            where: { Date: DateOfMatch.Date },
            attributes: ['id']
        });
        const teamMatchOnSameDate = await db.MatchTeams.findOne({
            where: {
                TeamId: TeamId,
                MatchId: { [db.Sequelize.Op.in]: matchesOnSameDate.map(m => m.id) }
            }
        });
        if (teamMatchOnSameDate) {
            return res.status(400).send({ message: 'Team already has a match on the same date' });
        }
        await db.MatchTeams.create({ MatchId, TeamId });
        return res.status(201).send({ message: 'Team added to Match successfully' });

    } catch (err) {
        return res.status(400).send(err);
    }
};

const getTeamsOfMatch = async (req, res) => {
    try {
        const matchTeams = await db.MatchTeams.findAll({ 
            where: { MatchId: req.params.MatchId }
        });
        if (matchTeams.length === 0) {
            return res.status(404).send({ message: 'No teams found for this match' });
        }
        return res.status(200).send(matchTeams);
    } catch (err) {
        return res.status(400).send(err);
    }
};

const getMatchesOfTeam = async (req, res) => {
    try {
        const matchTeams = await db.MatchTeams.findAll({
            where: { TeamId: req.params.TeamId }
        });
        if (matchTeams.length === 0) {
            return res.status(404).send({ message: 'No matches found for this team' });
        }
        return res.status(200).send(matchTeams);
    } catch (err) {
        return res.status(400).send(err);
    }
};

const removeTeamFromMatch = async (req, res) => {
    try {
        const { MatchId, TeamId } = req.body;
        if (!MatchId || !TeamId) {
            return res.status(400).send({ message: 'MatchId and TeamId are required' });
        }
        await db.MatchTeams.destroy({ where: { MatchId, TeamId } });
        return res.status(200).send({ message: 'Team removed from Match successfully' });
    }catch (err) {
        return res.status(400).send(err);
    }
};

module.exports = {
    addTeamTOMatch,
    getTeamsOfMatch,
    getMatchesOfTeam,
    removeTeamFromMatch
};