const express = require('express')
const router = express.Router()
const WAT_controller = require('../controllers/workoutAndTest-controller')

router.get('/getAllWAT',WAT_controller.getAllWAT);

router.get('/getOneWAT/:id',WAT_controller.getOneWAT);

router.post('/createWAT',WAT_controller.createWAT);

router.delete('/deleteWAT/:id',WAT_controller.deleteWAT);

router.patch('/updateWAT/:id',WAT_controller.updateWAT);

module.exports = router