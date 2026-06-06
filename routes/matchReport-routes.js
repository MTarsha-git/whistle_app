const express = require('express');
const router = express.Router();
const matchReportController = require('../controllers/matchReport-controller'); 
const auth = require('../middleware/auth-maddleware');
const isAdmin = require('../middleware/isAdmin');
const isReferee = require('../middleware/isReferee');
router.use(auth);

router.post('/createMatchReport',isReferee,isAdmin, matchReportController.createMatchReport);
router.get('/getMatchReport/:id', matchReportController.getMatchReport);
router.get('/getMatchReportOfMatch/:MatchId', matchReportController.getMatchReportOfMatch);
router.patch('/updateMatchReport/:id', matchReportController.updateMatchReport);
router.delete('/deleteMatchReport/:id', matchReportController.deleteMatchReport);

module.exports = router;

//my api endpoints are :
//http://localhost:3000/api/matchReport/createMatchReport
//http://localhost:3000/api/matchReport/getMatchReport/:id
//http://localhost:3000/api/matchReport/getMatchReportOfMatch/:MatchId
//http://localhost:3000/api/matchReport/updateMatchReport/:id
//http://localhost:3000/api/matchReport/deleteMatchReport/:id