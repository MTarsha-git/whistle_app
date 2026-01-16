const express = require('express')
const router = express.Router()
const user = require('../controllers/user-controller')
const upload = require('../config/multer')
const auth = require('../middleware/auth-maddleware')
const isAdmin = require('../middleware/isAdmin')
const isReferee = require('../middleware/isReferee')
// All routes protected and only accessible by authenticated users
//router.use(auth)

router.get('/getAllUsers', isAdmin, user.getAllUsers);

router.get('/getAllReferees',isAdmin,user.getAllReferee);

router.get('/getAllRefereeAssessor',isAdmin,user.getAllRefereeAssessor);

router.get('/getUser/:id', isReferee ,user.getOneUser);

router.post('/createUser', /*isAdmin,*/ upload.single('photo'), user.createUser);

router.patch('/editUser/:id', isAdmin, upload.single('photo'), user.updateUser);

router.delete('/deleteUser/:id', isAdmin, user.deleteUser);

module.exports = router
