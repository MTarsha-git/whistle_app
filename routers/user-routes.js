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

route.get('/getUser/:id',(req,res,next)=>{
    db.User.findOne({
        where:{id:req.params.id},
        include:[{model:db.Referee},{model:db.Role}]})
    .then((response)=> 
        res.status(200).send({
            message: 'User fetched successfully',
            data: response
    }))
    .catch((err)=>res.status(400).send(err))

})
route.post('/createUser', async (req, res) => {
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
  } catch (err) {
    await t.rollback();
    res.status(400).json({ message: 'Error creating records', error: err.message });
  }
});

route.patch('/editUser/:id', (req, res ,next) => {
    db.User.update({
        userName:req.body.userName,
        email : req.body.email,
        password : req.body.password,
        phoneNumber : req.body.phoneNumber,
        birthDate   : req.body.birthDate,
        address  : req.body.address,
        photo   : req.body.photo,
        
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
