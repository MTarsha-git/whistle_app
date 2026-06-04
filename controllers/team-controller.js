const db = require("../models");

const createTeam = async (req, res) => {
    try{
        const { TeamName, TeamManager, Coach, AssistantCoach, KeeperCoach, PhysicalTherapist,
             MediaOfficial, EquipmentManager, DegreeId, Players, TeamLogo } = req.body;

        // Validate required fields (players must be present and non-empty)
        if(!TeamName || !TeamManager || !Coach || !AssistantCoach || !KeeperCoach || !PhysicalTherapist ||
             !MediaOfficial || !EquipmentManager || !DegreeId || !TeamLogo){
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
        return res.status(200).send({
            message: 'Teams retrieved successfully',
            data: teams
        });
    } catch (err) {
        return res.status(400).send({
            message: 'Error retrieving teams',
            error: err.message
        });
    }
};
// Get one team by name, including its degree and players
const getOneTeamByName = async (req, res) => {
    try {
        const team = await db.Team.findOne({ 
            where: { TeamName: req.params.TeamName },
            include: db.Degree });

        if (!team) {
            return res.status(404).send({
                message: 'Team not found'
            });
        }
        const players = await db.Player.findAll({ 
            where: { TeamId: team.id } });
       
        return res.status(200).send({
            message: 'Team retrieved successfully',
            data: { ...team.get({ plain: true }), Players: players }
        });
    } catch (err) {
        return res.status(400).send({
            message: 'Error retrieving team',
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

const updateTeam = async (req, res) => {
    try {
        const updates = { ...req.body };

        const team = await db.Team.findOne({ where: { TeamName: req.params.TeamName } });
        if (!team) {
            return res.status(404).send({
                message: 'Team not found'
            });
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
    getManagersForOneTeamByName,
    deleteTeam,
    updateTeam
}