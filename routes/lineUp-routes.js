const express = require('express');
const router = express.Router();
const lineUpController = require('../controllers/lineUp-controller');
const auth = require('../middleware/auth-maddleware');
const isAdmin = require('../middleware/isAdmin');

// All routes protected and only accessible by admin users
router.use(auth);

router.post('/createLineUp',isAdmin,lineUpController.createLineUp);
router.get('/getLineUp',isAdmin,lineUpController.getLineUp);
router.get('/getLineUpsOfTeam/:TeamId',isAdmin,lineUpController.getLineUpsOfTeam);
router.get('/getLineUpsOfMatch/:MatchId',isAdmin,lineUpController.getLineUpsOfMatch);
router.get('/getLineUpOfTeamsInMatch/:MatchId/:TeamId',isAdmin,lineUpController.getLineUpOfTeamsInMatch);
router.delete('/deleteLineUp/:id',isAdmin,lineUpController.deleteLineUp); 
module.exports = router;

// my api endpoints:
// http://localhost:3000/api/lineUp/createLineUp
// http://localhost:3000/api/lineUp/getLineUp
// http://localhost:3000/api/lineUp/getLineUpsOfTeam/:TeamId
// http://localhost:3000/api/lineUp/getLineUpsOfMatch/:MatchId
// http://localhost:3000/api/lineUp/getLineUpOfTeamsInMatch/:MatchId/:TeamId
// http://localhost:3000/api/lineUp/deleteLineUp/:id
