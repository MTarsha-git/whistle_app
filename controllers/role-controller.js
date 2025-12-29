const db = require('../models')

const getAllRoles = (req,res)=>{
    db.Role.findAll()
    .then((response)=>{
            if (!response) {
                return res.status(404).send({
                    message: 'you do not have any roles'
                });
            }else{
                res.status(200).send({
                message: 'Role fetched successfully',
                data: response })
                }})
    .catch((err)=>res.status(400).send(err))
};

const getOneRole = async (req,res)=>{
    try {
        const Role = await db.Role.findOne({
            where:{id:req.params.id}})
            if (!Role) {
                return res.status(404).send({
                    message: 'Role not found'
                });
            }else{
                res.status(200).send({
                message: 'Role fetched successfully',
                data: Role 
                })
            }
    } catch (err) {
        res.status(400).send({
            message: 'Error fetching role',
            error: err.message
        });
    }
};

const createRole = async (req, res) => {
    try {
        const response = await db.Role.create({
            subject: req.body.subject
        });
        res.status(201).send({
            message: 'Role created successfully',
            data: response
        });
    } catch (err) {
        res.status(400).send({
            message: 'Error creating role',
            error: err.message
        });
    }
};

const deleteRole = async (req, res) => {
    try {
        const Role = await db.Role.findOne({
            where: { id: req.params.id }
        });
        if (!Role) {
            return res.status(404).send({
                message: 'Role not found'
            });
        }else{
            await Role.destroy();
        
        res.status(201).send({
            message: 'Role deleted successfully',
            data: Role
        });
        }
    } catch (err) {
        res.status(400).send({
            message: 'Error deleting role',
            error: err.message
        });
    }
};

const updateRole = async (req, res) => {
    try {
        const Role = await db.Role.findOne({
            where: { id: req.params.id }
        });
        if (!Role) {
            return res.status(404).send({
                message: 'Role not found'
            });
        }else{
            await Role.update({
                subject: req.body.subject
            });
        }
        res.status(201).send({
            message: 'Role updated successfully',
            data: Role
        });
    } catch (err) {
        res.status(400).send({
            message: 'Error updating role',
            error: err.message
        });
    }
};
module.exports = {
    getAllRoles,
    getOneRole,
    createRole,
    deleteRole,
    updateRole
}