const express = require('express')
const router = express.Router()
const db = require('../models')

router.get('/getAllRole',(req,res)=>{
    db.Role.findAll()
    .then((response)=>
        res.status(200).send({
            message:'Roles fetched successfully',
            data:response
    }))
    .catch((err)=>res.status(400).send(err))
})

router.post('/createRole', (req, res) => {
    db.Role.create({
     subject : req.body.subject
})
    .then((response)=> {
        res.status(201).send({
            message: 'Role created successfully',
            data: response
        })
    })    .catch((err) => {
        res.status(400).send({
            message: 'Error creating user',
            error: err.message
        })
    })
})
module.exports = router