const express = require('express');
const router = express.Router();
const matchTeamsController = require('../controllers/matchTeams-controller');
const auth = require('../middleware/auth-maddleware');
const isAdmin = require('../middleware/isAdmin');

// All routes protected and only accessible by admin users
router.use(auth);
router.use(isAdmin);

router.post('/addTeamToMatch', matchTeamsController.addTeamTOMatch);

router.get('/getTeamsOfMatch/:MatchId', matchTeamsController.getTeamsOfMatch);

router.get('/getMatchesOfTeam/:TeamId', matchTeamsController.getMatchesOfTeam);

router.delete('/removeTeamFromMatch', matchTeamsController.removeTeamFromMatch);

module.exports = router;

/*my api for matchTeams:
http://localhost:3000/api/matchTeams/addTeamToMatch
http://localhost:3000/api/matchTeams/getTeamsOfMatch/:MatchId
http://localhost:3000/api/matchTeams/getMatchesOfTeam/:TeamId
http://localhost:3000/api/matchTeams/removeTeamFromMatch
*/