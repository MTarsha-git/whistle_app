const express = require('express')
const router = express.Router()
const user = require('../controllers/user-controller')
const upload = require('../config/multer')

router.get('/getAllUsers',user.getAllUsers);

router.get('/getAllReferees',user.getAllReferee);

router.get('/getAllRefereeAssessor',user.getAllRefereeAssessor);

router.get('/getUser/:id', user.getOneUser);

router.post('/createUser', upload.single('photo'), user.createUser);

router.patch('/editUser/:id', upload.single('photo'), user.updateUser);

router.delete('/deleteUser/:id', user.deleteUser);

module.exports = router
