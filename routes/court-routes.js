const express = require("express")
const router = express.Router()
const court_controller = require("../controllers/court-controller")
const auth = require('../middleware/auth-maddleware')
const isAdmin = require('../middleware/isAdmin')

router.get('/getAllCourt',auth,isAdmin,court_controller.getAllCourt);

router.get('/getOneCourt/:id',auth,isAdmin,court_controller.getOneCourt);

router.post('/createCourt',auth,isAdmin,court_controller.createCourt);
 
router.patch('/updateCourt/:id',auth,isAdmin,court_controller.updateCourt);

router.delete('/deleteCourt/:id',auth,isAdmin,court_controller.deleteCourt);

module.exports = router;

/*
my api endpoints:
http://localhost:3000/api/court/createCourt
http://localhost:3000/api/court/getAllCourt
http://localhost:3000/api/court/getOneCourt/:id
http://localhost:3000/api/court/updateCourt/:id
http://localhost:3000/api/court/deleteCourt/:id

*/