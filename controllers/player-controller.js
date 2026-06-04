const db = require("../models")

const createPlayer = async (req,res)=>{
    try {
        const {PlayerName,Number,Position,TeamId} = req.body
        if(!PlayerName || !Number || !Position || !TeamId){
            return res.status(400).json({error:"All fields are required"})
        }
        // Check if the team exists
        const team = await db.Team.findByPk(TeamId)
        if(!team){
            return res.status(404).json({error:"Team not found"})
        }
        const player = await db.Player.create({
            PlayerName,
            Number,
            Position,
            photo: req.file ? `/uploads/${req.file.filename}` : req.body.photo,
            TeamId
        })
        res.status(201).json(player)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
};

const updatePlayer = async (req,res)=>{
    try {
        const {PlayerName,Number,Position,TeamId,RCard,YCard,Goal,onGoal} = req.body
        const player = await db.Player.findByPk(req.params.id)
        if(!player){
            return res.status(404).json({error:"Player not found"})
        }
        const team = await db.Team.findByPk(TeamId)
        if(!team){
            return res.status(404).json({error:"Team not found"})
        }
        await player.update({PlayerName,Number,Position,TeamId})
        res.status(200).json(player)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
};

const getAllPlayers = async (req,res)=>{
    try {
        const players = await db.Player.findAll()
        if(players.length === 0){
            return res.status(404).json({error:"No players found"})
        }
        res.status(200).json(players)}
    catch (error) {
        res.status(500).json({error:error.message})
    }
};

const getAllPlayersOfTeam = async (req,res)=>{
    try {
        const team = await db.Team.findByPk(req.params.TeamId)
        if(!team){
            return res.status(404).json({error:"Team not found"})
        }
        const players = await db.Player.findAll({where:{TeamId:req.params.TeamId}})
        res.status(200).json(players)}
    catch (error) {
        res.status(500).json({error:error.message})
    }
};

const deletePlayer = async (req,res)=>{
    try {
        const player = await db.Player.findByPk(req.params.id)
        if(!player){
            return res.status(404).json({error:"Player not found"})
        }
        await player.destroy()
        res.status(200).json({message:"Player deleted successfully"})
    } catch (error) {
        res.status(500).json({error:error.message})
    }
};

module.exports = {
    createPlayer,
    updatePlayer,
    getAllPlayersOfTeam,
    getAllPlayers,
    deletePlayer
}