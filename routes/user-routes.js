const express = require('express')
const route = express.Router()
const db = require('../models')
const Referee = require('../models/Referee')

route.get('/getAllUsers',(req,res)=>{
    db.User.findAll()
    .then((response)=>
        res.status(200).send({
            message: 'Users fetched successfully',
            data: response
    }))
    .catch((err)=>res.status(400).send(err))
})

route.get('/getUser/:id', async (req, res, next) => {
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
})
route.post('/createUser', async (req, res) => {
    if(req.body.RoleId == 3){
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
              password: req.body.password,
              phoneNumber: req.body.phoneNumber,
              birthDate: req.body.birthDate,
              address: req.body.address,
              photo: req.body.photo,
              RefereeId: referee.id,
              RoleId: req.body.RoleId
            }, { transaction: t });

            await t.commit();
            res.status(201).json({ message: 'User and Referee created', user, referee });
  }      catch (err) {
            await t.rollback();
            res.status(400).json({ message: 'Error creating records', error: err.message });
  }}
else{
     const user = db.User.create({
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
      phoneNumber: req.body.phoneNumber,
      birthDate: req.body.birthDate,
      address: req.body.address,
      photo: req.body.photo,
      RoleId: req.body.RoleId
    })

    .then((user)=> {
    res.status(201).json({ message: 'User created', user });
    })
    .catch((err) => {
    res.status(400).json({ message: 'Error creating records', error: err.message });
  })}
}
);

route.patch('/editUser/:id', (req, res ,next) => {
    db.User.update({
        userName:req.body.userName,
        email : req.body.email,
        password : req.body.password,
        phoneNumber : req.body.phoneNumber,
        birthDate   : req.body.birthDate,
        address  : req.body.address,
        photo   : req.body.photo,
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
})
route.delete('/deleteUser/:id',(req,res,next)=>{
    db.User.destroy({where:{id:req.params.id}})
    .then((response)=>
        res.status(200).send({
            message: 'User deleted successfully',
            data: response
    }))
    .catch((err)=>res.status(400).send(err))
})
module.exports = route
