const db = require('../models');

const createRefereeEvaluation = async (req, res) => {
    try {
        const { UserId, MatchId, Evaluation ,description } = req.body; 
        // Validate required fields
        if (!UserId || !MatchId || Evaluation === undefined) {
            return res.status(400).json({ error: 'UserId, MatchId and Evaluation are required.' });
        }
        // Check if User exists
        const user = await db.User.findByPk(UserId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        // Check if Match exists
        const match = await db.Match.findByPk(MatchId);
        if (!match) {
            return res.status(404).json({ error: 'Match not found.' });
        }
        // Check if the user is assigned as a referee for the match
        const assignment = await db.Assignment.findOne({ where: { UserId, MatchId } });
        if (!assignment) {
            return res.status(400).json({ error: 'User is not assigned as a referee for this match.' });
        }   
        // Check if the user has already evaluated the match
        const existingEvaluation = await db.RefereeEvaluation.findOne({ where: { UserId, MatchId } });  
        if (existingEvaluation) {
            return res.status(400).json({ error: 'User has already evaluated this match.' });
        }
        // Create the referee evaluation
        const refereeEvaluation = await db.RefereeEvaluation.create({
            UserId,
            MatchId,
            Evaluation,
            description
        });
        return res.status(201).json(refereeEvaluation);
    }catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getRefereeEvaluationsByMatch = async (req, res) => {
    try {
        const { MatchId } = req.params;
        // Check if Match exists
        const match = await db.Match.findByPk(MatchId);
        if (!match) {
            return res.status(404).json({ error: 'Match not found.' });
        }
        const evaluations = await db.RefereeEvaluation.findAll({ where: { MatchId } });
        if (evaluations.length === 0) {
            return res.status(404).json({ error: 'No evaluations found for this match.' });
        }
        return res.status(200).json(evaluations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllEvaluationsByUser = async (req, res) => {
    try {
        const { UserId } = req.params;
        // Check if User exists
        const user = await db.User.findByPk(UserId);
        if(!user){
            return res.status(404).json({error:'User not found. '});
        }
        const evaluations = await db.RefereeEvaluation.findAll({where:{UserId}});
        if(evaluations.length === 0){
            return res.status(404).json({error:'No evaluations found for this user. '});
        }
        return res.status(200).json(evaluations);
    
    }catch(error){
        res.status(500).json({error:error.message});
        }
    };
const deleteRefereeEvaluation = async (req, res) => {
    try {
        const { id } = req.params;

        const evaluation = await db.RefereeEvaluation.findByPk(id);
        if (!evaluation) {
            return res.status(404).json({ error: 'Referee evaluation not found.' });
        }

        await evaluation.destroy();
        return res.status(200).json({ message: 'Referee evaluation deleted successfully.' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createRefereeEvaluation,
    getRefereeEvaluationsByMatch,
    getAllEvaluationsByUser,
    deleteRefereeEvaluation,
};

