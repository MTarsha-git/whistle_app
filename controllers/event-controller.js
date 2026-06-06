const db = require('../models');

const createEvent = async (req, res) => {
    try{
        const { Time, TypeOfEventId, MatchId, PlayerId, TeamId } = req.body;

        // Validate required fields
        if (!Time || !TypeOfEventId || !MatchId || !PlayerId || !TeamId) {
            return res.status(400).json({ error: 'All fields are required.' });
        }
        //check if the type of event exists
        const typeOfEvent = await db.TypeOfEvent.findByPk(TypeOfEventId);
        if (!typeOfEvent) {
            return res.status(404).json({ error: 'Type of event not found.' });
        }
        //check if the match exists
        const match = await db.Match.findByPk(MatchId);
        if (!match) {
            return res.status(404).json({ error: 'Match not found.' });
        }
        //check if the team exists
        const team = await db.Team.findByPk(TeamId);
        if(!team){
            return res.status(404).json({ error: 'Team not found.' });
        }
        // Check if the team is added to the match
        const teamIsAddedToMatch = await db.MatchTeams.findOne({ where: { TeamId, MatchId } });
            if (!teamIsAddedToMatch) {
                return res.status(400).json({ error: 'Team is not added to the match' });
            }
        //check if the player exists
        const player = await db.Player.findByPk(PlayerId.Number, { where: { TeamId } });
        if (!player) {
            return res.status(404).json({ error: 'Player not found in the team.' });
        }
        
    }catch(error){
        res.status(500).json({ error: 'An error occurred while creating the event.' });
    }
};