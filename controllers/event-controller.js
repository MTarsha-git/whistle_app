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

        const requestedPlayerNumber = typeof PlayerId === 'object' && PlayerId !== null ? PlayerId.Number : PlayerId;
        let player = null;

        if (typeof PlayerId === 'number' || typeof PlayerId === 'string') {
            player = await db.Player.findOne({ where: { id: PlayerId, TeamId } });
        }

        if (!player && requestedPlayerNumber != null) {
            player = await db.Player.findOne({ where: { Number: requestedPlayerNumber, TeamId } });
        }

        if (!player) {
            return res.status(404).json({ error: 'Player not found in the team.' });
        }

        //check if the player is in the lineup of the match
        const lineUp = await db.LineUp.findOne({ where: { TeamId, MatchId } });
        if (!lineUp) {
            return res.status(404).json({ error: 'LineUp not found for this team and match.' });
        }

        const playerNumber = player.Number;
        const playerIsInParticipating = lineUp.ParticipatingPlayers.includes(playerNumber);
        const playerIsInSubstitutes = lineUp.substitutePlayers.includes(playerNumber);

        if (!playerIsInParticipating && !playerIsInSubstitutes) {
            return res.status(400).json({ error: 'Player is not in the lineup of the match.' });
        }

        if (playerIsInParticipating) {
            //check if the player is replaced before the event time
            const replaced = await db.Event.findOne({
                where: {
                    MatchId,
                    PlayerId: player.id,
                    Time: { [db.Sequelize.Op.lt]: Time },
                    TypeOfEventId: 5
                }
            });
            if (replaced) {
                return res.status(400).json({ error: 'Player is replaced before the event time.' });
            }
        }

        if (playerIsInSubstitutes) {
            //check if the player is substituted in before the event time
            const substitutedIn = await db.Event.findOne({
                where: {
                    MatchId,
                    PlayerId: player.id,
                    Time: { [db.Sequelize.Op.lt]: Time },
                    TypeOfEventId: 5
                }
            });
            if (!substitutedIn) {
                return res.status(400).json({ error: 'Player is not substituted in before the event time.' });
            }
        }

        const event = await db.Event.create({
            Time,
            TypeOfEventId,
            MatchId,
            PlayerId: player.id,
            TeamId
        });
        //type of event id 1 for RedCard , 2 for yellow card , 3 for Goal , 4 for OnGoal  and 5 for substitution
        switch (TypeOfEventId) {
            case 1: // Red Card
                await player.update({ RCard: player.RCard + 1 });
                break;
            case 2: // Yellow Card
                await player.update({ YCard: player.YCard + 1 });
                break;
            case 3: // Goal
                await player.update({ goal: player.goal + 1 });
                break;
            case 4: // OnGoal 
                await player.update({ onGoal: player.onGoal + 1 });
                break;
            case 5: // Substitution
                break;
        }
        return res.status(201).json(event);

    }catch(error){
        res.status(500).json({ error: 'An error occurred while creating the event.' });
    }
};

const getAllEventsForTeamInMatch = async (req, res) => {
    try {
        const { MatchId, TeamId } = req.params;
        // Check if Match exists        const match = await db.Match.findByPk(MatchId);
        if (!match) {
            return res.status(404).json({ error: 'Match not found' });
        }
        // Check if Team exists
        const team = await db.Team.findByPk(TeamId);
        if (!team) {
            return res.status(404).json({ error: 'Team not found' });
        }
        // Fetch all events for the team in the match
        const events = await db.Event.findAll({
            where: {
                MatchId,
                TeamId
            }
        });
        return res.status(200).json(events);
    }catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching events.' });
    }
};

const getAllEventsForPlayerInMatch = async (req, res) => {
    try {
        const { MatchId, PlayerId } = req.params;
        // Check if Match exists
        const match = await db.Match.findByPk(MatchId);
        if (!match) {
            return res.status(404).json({ error: 'Match not found' });
        }
        // Check if Player exists
        const player = await db.Player.findByPk(PlayerId);
        if (!player) {
            return res.status(404).json({ error: 'Player not found' });
        }
        // Fetch all events for the player in the match
        const events = await db.Event.findAll({
            where: {
                MatchId,
                PlayerId
            }
        });
        return res.status(200).json(events);
    }catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching events.' });
    }
    };

const getAllEventsForMatch = async (req, res) => {
    try {
        const { MatchId } = req.params;
        // Check if Match exists
        const match = await db.Match.findByPk(MatchId);
        if (!match) {
            return res.status(404).json({ error: 'Match not found' });
        }
        // Fetch all events for the match
        const events = await db.Event.findAll({
            where: {
                MatchId
            }
        });
        return res.status(200).json(events);
    }catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching events.' });
    }
};

const deleteEvent = async (req, res) => {
    try {
        const event = await db.Event.findByPk(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        await event.destroy();
        return res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the event.' });
    }
};

module.exports = {
    createEvent,
    getAllEventsForTeamInMatch,
    getAllEventsForPlayerInMatch,
    deleteEvent,
    getAllEventsForMatch
};
