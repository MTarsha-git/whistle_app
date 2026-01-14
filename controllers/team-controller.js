const db = require("../models");

const createTeam = async (req, res) => {
    try{
        const { TeamName, TeamManager, Coach, AssistantCoach, KeeperCoach, PhysicalTherapist,
             MediaOfficial, EquipmentManager, DegreeId, Players, TeamLogo } = req.body;

        // Parse and normalize Players so DB stores structured data (not a string)
        let players = Players;
        if (typeof players === 'string') {
            try { players = JSON.parse(players); } catch (e) {
                return res.status(400).send({ message: 'Invalid Players JSON', error: e.message });
            }
        }

        if (players == null) players = [];
        if (!Array.isArray(players)) players = [players];

        players = players.map(p => {
            if (p == null || typeof p !== 'object') return p;
            const normalized = { ...p };
            ['num', 'sub', 'YCard', 'RCard', 'goal', 'onGoal'].forEach(k => {
                if (normalized[k] !== undefined && normalized[k] !== null) {
                    const n = Number(normalized[k]);
                    normalized[k] = Number.isNaN(n) ? normalized[k] : n;
                }
            });
            return normalized;
        });

        // Validate required fields (players must be present and non-empty)
        if(!TeamName || !TeamManager || !Coach || !AssistantCoach || !KeeperCoach || !PhysicalTherapist ||
             !MediaOfficial || !EquipmentManager || !DegreeId || !players || players.length === 0 || !TeamLogo){
            return res.status(400).send({
                message: 'All fields are required to create a team'
            });
        }

        const newTeam = await db.Team.create({
            TeamName,
            TeamManager,
            Coach,
            AssistantCoach,
            KeeperCoach,
            PhysicalTherapist,
            MediaOfficial,
            EquipmentManager,
            DegreeId,
            Players: players,
            TeamLogo
        });
        return res.status(201).send({
            message: 'Team created successfully',
            data: newTeam
        });
    }catch(err){
        return res.status(400).send({
            message: 'Error creating team',
            error: err.message
        });
    }
};

const getAllTeams = async (req, res) => {
    try {
        const teams = await db.Team.findAll();
        if (teams.length === 0) {
            return res.status(404).send({
                message: 'No teams found'
            });
        }

        // Map instances to plain objects and normalize Players
        const teamsData = teams.map(team => {
            const obj = team.get({ plain: true });
            let players = obj.Players;

            // Ensure players is an array and parse if it's a JSON string
            if (players == null) {
                players = [];
            } else if (typeof players === 'string') {
                try {
                    players = JSON.parse(players);
                } catch (e) {
                    players = [];
                }
            }

            if (!Array.isArray(players)) {
                players = [players];
            }

            // Normalize player fields: convert numeric-like strings to numbers
            players = players.map(p => {
                if (p == null || typeof p !== 'object') return p;
                const normalized = { ...p };
                ['num', 'sub', 'YCard', 'RCard', 'goal', 'onGoal'].forEach(k => {
                    if (normalized[k] !== undefined && normalized[k] !== null) {
                        const n = Number(normalized[k]);
                        normalized[k] = Number.isNaN(n) ? normalized[k] : n;
                    }
                });
                return normalized;
            });

            obj.Players = players;
            return obj;
        });

        return res.status(200).send({
            message: 'Teams retrieved successfully',
            data: teamsData
        });
    } catch (err) {
        return res.status(400).send({
            message: 'Error retrieving teams',
            error: err.message
        });
    }
};

const getOneTeamByName = async (req, res) => {
    try {
        const team = await db.Team.findOne({ where: { TeamName: req.params.TeamName } });
        if (!team) {
            return res.status(404).send({
                message: 'Team not found'
            });
        }

        // Convert instance to plain object and normalize Players
        const teamObj = team.get({ plain: true });
        let players = teamObj.Players;

        if (players == null) {
            players = [];
        } else if (typeof players === 'string') {
            try {
                players = JSON.parse(players);
            } catch (e) {
                players = [];
            }
        }

        if (!Array.isArray(players)) {
            players = [players];
        }

        players = players.map(p => {
            if (p == null || typeof p !== 'object') return p;
            const normalized = { ...p };
            ['num', 'sub', 'YCard', 'RCard', 'goal', 'onGoal'].forEach(k => {
                if (normalized[k] !== undefined && normalized[k] !== null) {
                    const n = Number(normalized[k]);
                    normalized[k] = Number.isNaN(n) ? normalized[k] : n;
                }
            });
            return normalized;
        });

        teamObj.Players = players;

        return res.status(200).send({
            message: 'Players retrieved successfully',
            data: teamObj
        });
    } catch (err) {
        return res.status(400).send({
            message: 'Error retrieving team',
            error: err.message
        });
    }
};

const getPlayersForOneTeamByName = async (req, res) => {
    try {
        const team = await db.Team.findOne({ where: { TeamName: req.params.TeamName } });
        if (!team) {
            return res.status(404).send({
                message: 'Team not found'
            });
        }
        // convert instance to plain object
        const teamObj = team.get({ plain: true });
        let players = teamObj.Players;

        if (players == null) {
            players = [];
        } else if (typeof players === 'string') {
            try {
                players = JSON.parse(players);
            } catch (e) {
                players = [];
            }
        }

        if (!Array.isArray(players)) {
            players = [players];
        }

        players = players.map(p => {
            if (p == null || typeof p !== 'object') return p;
            const normalized = { ...p };
            ['num', 'sub', 'YCard', 'RCard', 'goal', 'onGoal'].forEach(k => {
                if (normalized[k] !== undefined && normalized[k] !== null) {
                    const n = Number(normalized[k]);
                    normalized[k] = Number.isNaN(n) ? normalized[k] : n;
                }
            });
            return normalized;
        });
        teamObj.Players = players;

        return res.status(200).send({
            message: 'Players retrieved successfully',
            data: players
        });
    } catch (err) {
        return res.status(400).send({
            message: 'Error retrieving players for team',
            error: err.message
        });
    }
};

const getManagersForOneTeamByName = async (req, res) => {
    try {
        const team = await db.Team.findOne({ 
        where: { TeamName: req.params.TeamName },
        attributes: ['TeamManager', 'Coach', 'AssistantCoach', 'KeeperCoach', 'PhysicalTherapist', 
            'MediaOfficial', 'EquipmentManager'] });
        if (!team) {
            return res.status(404).send({
                message: 'Team not found'
            });
        }
        return res.status(200).send({
            message: 'Managers retrieved successfully',
            data: team
        });
    }catch (err) {
        return res.status(400).send({
            message: 'Error retrieving managers for team',
            error: err.message
        });
    }
};

const deleteTeam = async (req, res) => {
    try {
        const team = await db.Team.findOne({ where: { TeamName: req.params.TeamName } });   
        if (!team) {
            return res.status(404).send({
                message: 'Team not found'
            });
        }
        await team.destroy();
        return res.status(200).send({
            message: 'Team deleted successfully'
        });
    } catch (err) {
        return res.status(400).send({
            message: 'Error deleting team',
            error: err.message
        });
    }
};

const deletePlayers = async(req,res)=>{
    try{
        const team = await db.Team.findOne({ where: { TeamName: req.params.TeamName } });
        if (!team) {
            return res.status(404).send({
                message: 'Team not found'
            });
        }
        const teamObj = team.get({ plain: true });
        let players = teamObj.Players;
        if (typeof players === 'string') {
            try { players = JSON.parse(players); } catch (e) { players = []; }
        }
        if (!Array.isArray(players)) players = [players];
        const playerNumberToDelete = req.body.playerNumberToDelete;
        if (!Array.isArray(playerNumberToDelete)) {
            return res.status(400).send({
                message: 'Invalid player numbers to delete'
            });
        }
        const updatedPlayers = players.filter(player => {
            if (typeof player === 'object' && player !== null) {
                if (player.id !== undefined && playerNumberToDelete.includes(player.id)) {
                    return false;
                }
                if (player.num !== undefined && playerNumberToDelete.includes(player.num)) {
                    return false;
                }
                if (player.name !== undefined && playerNumberToDelete.includes(player.name)) {
                    return false;
                }
            }
            return true;
        });
        await team.update({ Players: updatedPlayers });
        return res.status(200).send({
            message: 'Players deleted successfully',
            data: updatedPlayers
        });
    } catch (err) {
        return res.status(400).send({
            message: 'Error deleting players',
            error: err.message
        });
    }
};

const updateTeam = async (req, res) => {
    try {
        const updates = { ...req.body };

        const team = await db.Team.findOne({ where: { TeamName: req.params.TeamName } });
        if (!team) {
            return res.status(404).send({
                message: 'Team not found'
            });
        }

        // Handle Players field specially: allow patching or replacing entries
        if (updates.Players !== undefined) {
            let incoming = updates.Players;
            if (typeof incoming === 'string') {
                try { incoming = JSON.parse(incoming); } catch (e) {
                    return res.status(400).send({ message: 'Invalid Players JSON', error: e.message });
                }
            }

            if (!Array.isArray(incoming)) incoming = [incoming];

            // Get existing players
            const teamObj = team.get({ plain: true });
            let existing = teamObj.Players;
            if (typeof existing === 'string') {
                try { existing = JSON.parse(existing); } catch (e) { existing = []; }
            }
            if (existing == null) existing = [];
            if (!Array.isArray(existing)) existing = [existing];

            // If client requests full replace (send replacePlayers: true) we replace, otherwise we patch/merge
            const replaceFlag = updates.replacePlayers === true || updates.PlayersReplace === true;
            let finalPlayers;

            const normalizePlayer = (p) => {
                if (p == null || typeof p !== 'object') return p;
                const normalized = { ...p };
                ['num', 'sub', 'YCard', 'RCard', 'goal', 'onGoal'].forEach(k => {
                    if (normalized[k] !== undefined && normalized[k] !== null) {
                        const n = Number(normalized[k]);
                        normalized[k] = Number.isNaN(n) ? normalized[k] : n;
                    }
                });
                return normalized;
            };

            if (replaceFlag) {
                finalPlayers = incoming.map(normalizePlayer);
            } else {
                // Patch/merge each incoming object into existing players by id, then num, then name
                incoming.forEach(patch => {
                    if (patch == null || typeof patch !== 'object') return;
                    let idx = -1;
                    if (patch.id !== undefined) idx = existing.findIndex(e => e && e.id == patch.id);
                    if (idx === -1 && patch.num !== undefined) idx = existing.findIndex(e => e && e.num == patch.num);
                    if (idx === -1 && patch.name !== undefined) idx = existing.findIndex(e => e && e.name == patch.name);

                    if (idx !== -1) {
                        existing[idx] = { ...existing[idx], ...patch };
                    } else {
                        existing.push(patch);
                    }
                });
                finalPlayers = existing.map(normalizePlayer);
            }

            updates.Players = finalPlayers;
            // cleanup any replace flag provided by client
            delete updates.replacePlayers;
            delete updates.PlayersReplace;
        }

        const updatedTeam = await team.update(updates);
        return res.status(200).send({
            message: 'Team updated successfully',
            data: updatedTeam
        });
    } catch (err) {
        return res.status(400).send({
            message: 'Error updating team',
            error: err.message
        });
    }
};

module.exports = {
    createTeam,
    getAllTeams,
    getOneTeamByName,
    getPlayersForOneTeamByName,
    getManagersForOneTeamByName,
    deleteTeam,
    deletePlayers,
    updateTeam
}