const db = require('../models')

const getAllDegrees = (req,res)=>{
    db.Degree.findAll()
    .then((response)=>{
            if (!response) {
                return res.status(404).send({
                    message: 'you do not have any degrees'
                });
            }else{
                res.status(200).send({
                message: 'Degree fetched successfully',
                data: response })
                }})
    .catch((err)=>res.status(400).send(err))
};

const getOneDegree = async (req,res)=>{
    try {
        const Degree = await db.Degree.findOne({
            where:{id:req.params.id}})
            if (!Degree) {
                return res.status(404).send({
                    message: 'Degree not found'
                });
            }else{
                res.status(200).send({
                message: 'Degree fetched successfully',
                data: Degree
                })
            }
    } catch (err) {
        res.status(400).send({
            message: 'Error fetching degree',
            error: err.message
        });
    }
};

const createDegree = async (req, res) => {
    try {
        const response = await db.Degree.create({
            TypeOfDegree: req.body.TypeOfDegree
        });
        res.status(201).send({
            message: 'Degree created successfully',
            data: response
        });
    } catch (err) {
        res.status(400).send({
            message: 'Error creating degree',
            error: err.message
        });
    }
};

const deleteDegree = async (req, res) => {
    try {
        const Degree = await db.Degree.findOne({
            where: { id: req.params.id }
        });
        if (!Degree) {
                res.status(404).send({
                message: 'Degree not found'
            });
        }else{
            await Degree.destroy();
        
        res.status(201).send({
            message: 'Degree deleted successfully',
            data: Degree
        });
        }
    } catch (err) {
        res.status(400).send({
            message: 'Error deleting degree',
            error: err.message
        });
    }
};

const updateDegree = async (req, res) => {
    try {
        const Degree = await db.Degree.findOne({
            where: { id: req.params.id }
        });
        if (!Degree) {
            return res.status(404).send({
                message: 'Degree not found'
            });
        }else{
            await Degree.update({
                TypeOfDegree: req.body.TypeOfDegree
            });
        }
        res.status(201).send({
            message: 'Degree updated successfully',
            data: Degree
        });
    } catch (err) {
        res.status(400).send({
            message: 'Error updating degree',
            error: err.message
        });
    }
};
module.exports = {
    getAllDegrees,
    getOneDegree,
    createDegree,
    deleteDegree,
    updateDegree
}