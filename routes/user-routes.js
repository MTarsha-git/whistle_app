const express = require('express')
const router = express.Router()
const user = require('../controllers/user-controller')

router.get('/getAllUsers',user.getAllUsers);

router.get('/getAllReferees',user.getAllReferee);

router.get('/getAllRefereeAssessor',user.getAllRefereeAssessor);

router.get('/getUser/:id', user.getOneUser);

router.post('/createUser', user.createUser);

router.patch('/editUser/:id', user.updateUser);

router.delete('/deleteUser/:id', user.deleteUser);

module.exports = router
