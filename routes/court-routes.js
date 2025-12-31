const express = require("express")
const router = express.Router()
const court_controller = require("../controllers/court-controller")

router.get('/getAllCourt',court_controller.getAllCourt);

router.get('/getOneCourt/:id',court_controller.getOneCourt);

router.post('/createCourt',court_controller.createCourt);

router.patch('/updateCourt/:id',court_controller.updateCourt);

router.delete('/deleteCourt/:id',court_controller.deleteCourt);

module.exports = router;