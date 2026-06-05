const db = require('../models');

const createLineUp = async (req, res) => {
    try {
        const { ParticipatingPlayers, substitutePlayers, kitColor, shortColor, socksColor, TeamId, MatchId } = req.body;
        if (!ParticipatingPlayers || !substitutePlayers || !TeamId || !MatchId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        // Check if Team exists
        const team = await db.Team.findByPk(TeamId);
        if (!team) {
            return res.status(404).json({ error: 'Team not found' });
        }
        // Check if Match exists
        const match = await db.Match.findByPk(MatchId);
        if (!match) {
            return res.status(404).json({ error: 'Match not found' });
        }
        // Check if LineUp already exists for this Team and Match
        const existingLineUp = await db.LineUp.findOne({ where: { TeamId, MatchId } });
        if (existingLineUp) {
            return res.status(400).json({ error: 'LineUp already exists for this Team and Match' });
        }
        //get Number of players in the team and store it in set data type variable
        const playersInTeam = await db.Player.findAll({ 
            where: { TeamId },
            attributes: ['Number'],
             raw: true
             });
        const playerNumbersInTeam = new Set(playersInTeam.map(player => player.Number));
        //check if any number in participating players or substitute players is not redundant
        const participatingPlayerNumbers = new Set(ParticipatingPlayers);
        const substitutePlayerNumbers = new Set(substitutePlayers);
        const sum2set = new Set([...participatingPlayerNumbers,...substitutePlayerNumbers]);

        if (sum2set.size != (participatingPlayerNumbers.size + substitutePlayerNumbers.size)) {
            return res.status(400).json({ error: 'Some player numbers are duplicated in participating or substitute players' });
        }

        // Check if ParticipatingPlayers and substitutePlayers are in the team
        for(const playerNumber of sum2set){
            if (!playerNumbersInTeam.has(playerNumber)) {
                return res.status(400).json({ error: 'Some players are not in the team' });
            }
        }
        const lineUp = await db.LineUp.create({
            ParticipatingPlayers,
            substitutePlayers,
            kitColor,
            shortColor,
            socksColor,
            TeamId,
            MatchId
        });
        return res.status(201).json(lineUp);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getLineUp = async (req, res) => {
    try {
        const lineUp = await db.LineUp.findByPk(req.params.id);
        if (!lineUp) {
            return res.status(404).json({ error: 'LineUp not found' });
        }
        return res.status(200).json(lineUp);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }   
};

const getLineUpsOfMatch = async (req, res) => {
    try {
        const MatchExisted = await db.Match.findByPK(req.params.MatchId);
        if(!MatchExisted){
            return res.status(404).json({error:'Match not found'})
        }
        const lineUps = await db.LineUp.findAll({ where: { MatchId: req.params.MatchId } });
        if (lineUps.length === 0) {
            return res.status(404).json({ error: 'No LineUps found for this Match' });
        }
    }catch(error){
        res.status(500).json({error:error.message})      
    }
};

const getLineUpsOfTeam = async (req, res) => {
    try {
        const TeamExisted = await db.Team.findByPK(req.params.TeamId);
        if(!TeamExisted){
            return res.status(404).json({error:'Team not found'});
        }
        const lineUps = await db.LineUp.findAll({ where: { TeamId: req.params.TeamId } });
        if (lineUps.length === 0) {
            return res.status(404).json({ error: 'No LineUps found for this Team' });
        }
        return res.status(200).json(lineUps);
    }catch(error){
        res.status(500).json({error:error.message})      
    }
};

const getLineUpOfTeamsInMatch = async (req, res) => {
    try{
        const { MatchId, TeamId } = req.params;
        const MatchExisted = await db.Match.findByPK(MatchId);
        if(!MatchExisted){
            return res.status(404).json({error:'Match not found'})
        }
        const TeamExisted = await db.Team.findByPK(TeamId);
        if(!TeamExisted){
            return res.status(404).json({error:'Team not found'});
        }
        const lineUp = await db.LineUp.findOne({ where: { MatchId, TeamId } });
        if (!lineUp) {
            return res.status(404).json({ error: 'No LineUps found for this Team in the specified Match' });
        }
        return res.status(200).json(lineUp);

    }catch(error){
        res.status(500).json({error:error.message})
    }
};

const deleteLineUp = async (req, res) => {
    try {
        const lineUp = await db.LineUp.findByPk(req.params.id);
        if (!lineUp) {
            return res.status(404).json({ error: 'LineUp not found' });
        }
        await lineUp.destroy();
        return res.status(200).json({ message: 'LineUp deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createLineUp,
    deleteLineUp,
    getLineUp,
    getLineUpsOfMatch,
    getLineUpsOfTeam,
    getLineUpOfTeamsInMatch
};