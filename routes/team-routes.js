const express = require('express');
const router = express.Router();
const teamController = require('../controllers/team-controller');
const auth = require('../middleware/auth-maddleware');
const isAdmin = require('../middleware/isAdmin');
// All routes protected and only accessible by admin users
router.use(auth);
router.use(isAdmin);

router.post('/createTeam', teamController.createTeam);

router.get('/getAllTeams', teamController.getAllTeams);

router.get('/getOneTeam/:TeamName', teamController.getOneTeamByName);

router.get('/getPlayersForOneTeam/:TeamName', teamController.getPlayersForOneTeamByName);

router.get('/getManagersForOneTeam/:TeamName', teamController.getManagersForOneTeamByName);

router.delete('/deleteTeam/:TeamName', teamController.deleteTeam);

router.delete('/deletePlayers/:TeamName', teamController.deletePlayers);

router.patch('/updateTeam/:TeamName', teamController.updateTeam);

/*my api for team:
http://localhost:3000/api/team/createTeam
http://localhost:3000/api/team/getAllTeams
http://localhost:3000/api/team/getOneTeam/:TeamName
http://localhost:3000/api/team/getPlayersForOneTeam/:TeamName
http://localhost:3000/api/team/getManagersForOneTeam/:TeamName
http://localhost:3000/api/team/deleteTeam/:TeamName
http://localhost:3000/api/team/deletePlayers/:TeamName
http://localhost:3000/api/team/updateTeam/:TeamName


*/

module.exports = router;