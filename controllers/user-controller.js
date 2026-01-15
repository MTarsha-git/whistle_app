const db = require('../models')
const bcrypt = require('bcrypt');


const getAllUsers = (req,res)=>{
    db.User.findAll()
    .then((response)=>
        res.status(200).send({
            message: 'Users fetched successfully',
            data: response
    }))
    .catch((err)=>res.status(400).send(err))
};

const getAllReferee = async (req,res)=>{
    try{
        const allReferees = await db.User.findAll({
        where: { RoleId: 3 },
        include: [{ model: db.Referee }]
    });
    return res.status(200).send({
        message: 'Referees fetched successfully',
        data: allReferees });
    }catch(err){
    return res.status(400).send(err);
    }
};

const getAllRefereeAssessor = async (req,res)=>{
    try{const allRefereesAssessor = await db.User.findAll({
        where: { RoleId: 2 },
        include: [{ model: db.Role }]
    });
    return res.status(200).send({ message: 'Referees Assessor fetched successfully', data: allRefereesAssessor });
    }catch(err){
    return res.status(400).send(err);
    }
};

const getOneUser = async (req, res) => {
    try {
        // fetch basic user to determine the role
        const basicUser = await db.User.findOne({ where: { id: req.params.id } });
        if (!basicUser) {
            return res.status(404).send({ message: 'User not found' });
        }else{       

        // include Role always; include Referee additionally when RoleId === 3
        const includeModels = basicUser.RoleId == 3 ? [{ model: db.Role }, { model: db.Referee }] : [{ model: db.Role }];

        const user = await db.User.findOne({ where: { id: req.params.id }, include: includeModels });

        return res.status(200).send({ message: 'User fetched successfully', data: user });
        }
    } catch (err) {
        return res.status(400).send(err);
    }
};

const createUser = async (req, res) => {
    try {
        const existingEmail = await db.User.findOne({ where: { email: req.body.email } })
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        if (req.body.RoleId == 3) {
            const t = await db.sequelize.transaction();
            try {
                const referee = await db.Referee.create({
                    degree: req.body.degree,
                    specification: req.body.specification,
                    status: req.body.status,
                    AFCNumber: req.body.AFCNumber
                }, { transaction: t });

                const user = await db.User.create({
                    userName: req.body.userName,
                    email: req.body.email,
                    password: hashedPassword,
                    phoneNumber: req.body.phoneNumber,
                    birthDate: req.body.birthDate,
                    address: req.body.address,
                    photo: req.file ? `/uploads/${req.file.filename}` : req.body.photo,
                    RefereeId: referee.id,
                    RoleId: req.body.RoleId
                }, { transaction: t });

                await t.commit();
                return res.status(201).json({ message: 'User and Referee created', user, referee });
            } catch (err) {
                await t.rollback();
                return res.status(400).json({ message: 'Error creating records', error: err.message });
            }
        } else {
            const user = await db.User.create({
                userName: req.body.userName,
                email: req.body.email,
                password: hashedPassword,
                phoneNumber: req.body.phoneNumber,
                birthDate: req.body.birthDate,
                address: req.body.address,
                photo: req.file ? `/uploads/${req.file.filename}` : req.body.photo,
                RoleId: req.body.RoleId
            })

            return res.status(201).json({ message: 'User created', user });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Error creating user', error: err.message });
    }
};

const updateUser = (req, res ) => {
    db.User.update({
        userName:req.body.userName,
        email : req.body.email,
        password : req.body.password,
        phoneNumber : req.body.phoneNumber,
        birthDate   : req.body.birthDate,
        address  : req.body.address,
        photo   : req.file ? `/uploads/${req.file.filename}` : req.body.photo,
        RoleId : req.body.RoleId
        
        },{where:{id:req.params.id}})
    .then((response)=> {
        res.status(201).send({
            message: 'User created successfully',
            data: response
        })
    }) 
    .catch(err => {
        res.status(400).send({
            message: 'Error creating user',
            error: err.message
        })
    })
};
const deleteUser = async(req,res)=>{
    try{
        const user = await db.User.findOne({ where: { id: req.params.id } });
        if (!user) {
            return res.status(404).send({message:'User not found'});    
        }else{
            if(user.RoleId == 3){
                await db.Referee.destroy({where:{id:user.RefereeId}})
                await user.destroy();
                res.status(201).send({
                    message:'User and associated Referee deleted successfully'});
            }
            else{
                await user.destroy();
                res.status(201).send({message:'User deleted successfully'});
            }
        }
    } catch(err){
            res.status(400).send({
                message:'Error deleting user',
                error:err.message
            })
        }  
};
module.exports = {
    getAllUsers,
    getAllReferee,
    getAllRefereeAssessor,
    getOneUser,
    createUser,
    updateUser,
    deleteUser
}