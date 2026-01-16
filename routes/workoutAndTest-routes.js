const express = require('express')
const router = express.Router()
const WAT_controller = require('../controllers/workoutAndTest-controller')
const auth = require('../middleware/auth-maddleware')
const isAdmin = require('../middleware/isAdmin')

router.use(auth)

router.get('/getAllWAT',isAdmin,WAT_controller.getAllWAT);

router.get('/getAllTests',isAdmin,WAT_controller.getAllTests);

router.get('/getAllWorkouts',isAdmin,WAT_controller.getAllWorkouts);
 
router.get('/getOneWAT/:id',WAT_controller.getOneWAT);

router.post('/createWAT',isAdmin,WAT_controller.createWAT);

router.delete('/deleteWAT/:id',isAdmin,WAT_controller.deleteWAT);

router.patch('/updateWAT/:id',isAdmin,WAT_controller.updateWAT);

module.exports = router

/*my api endpoints:
http://localhost:3000/api/wat/getAllWAT  -->GET  (admin only)
http://localhost:3000/api/wat/getAllTests  -->GET  (admin only)
http://localhost:3000/api/wat/getAllWorkouts  -->GET  (admin only)
http://localhost:3000/api/wat/getOneWAT/:id  -->GET
http://localhost:3000/api/wat/createWAT  -->POST  (admin only) send WAT data in body
http://localhost:3000/api/wat/deleteWAT/:id  -->DELETE  (admin only)
http://localhost:3000/api/wat/updateWAT/:id  -->PATCH  (admin only) send updated data in body
*/