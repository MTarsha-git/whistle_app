const express = require('express')
const router = express.Router()
const role_controller = require('../controllers/role-controller')
const auth = require('../middleware/auth-maddleware')
const isAdmin = require('../middleware/isAdmin')

// All routes protected and only accessible by admin users
router.use(auth)
router.use(isAdmin)

router.get('/getAllRole',role_controller.getAllRoles);

router.get('/getOneRole/:id',role_controller.getOneRole);

router.post('/createRole',role_controller.createRole);

router.delete('/deleteRole/:id',role_controller.deleteRole);

router.patch('/updateRole/:id',role_controller.updateRole);

module.exports = router

/*my api for role:
http://localhost:3000/api/role/getAllRole
http://localhost:3000/api/role/getOneRole/:id
http://localhost:3000/api/role/createRole
http://localhost:3000/api/role/deleteRole/:id
http://localhost:3000/api/role/updateRole/:id
*/