const express = require('express')
const router = express.Router()
const role_controller = require('../controllers/role-controller')

router.get('/getAllRole',role_controller.getAllRoles);

router.get('/getOneRole/:id',role_controller.getOneRole);

router.post('/createRole',role_controller.createRole);

router.delete('/deleteRole/:id',role_controller.deleteRole);

router.patch('/updateRole/:id',role_controller.updateRole);

module.exports = router