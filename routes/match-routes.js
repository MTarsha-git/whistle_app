const express = require('express');
const router = express.Router();
const matchController = require('../controllers/match-controller');
const notConfinedInMatch = require('../middleware/notConfinedInMatch');
const notConfinedInWAT = require('../middleware/notConfinedInWAT');
const auth = require('../middleware/auth-maddleware');
const isAdmin = require('../middleware/isAdmin');
const isReferee = require('../middleware/isReferee');
// All routes protected: require authentication
router.use(auth);


router.post('/createMatch', isAdmin, notConfinedInMatch, notConfinedInWAT, matchController.createMatch);

router.get('/getAllMatches', isAdmin, matchController.getMatches);

router.get('/getOneMatch/:id', isReferee, matchController.getOneMatch);

router.delete('/deleteMatch/:id', isAdmin, matchController.deleteMatch);

module.exports = router;
/*
my api for match:
http://localhost:3000/api/match/createMatch
http://localhost:3000/api/match/getAllMatches
http://localhost:3000/api/match/getOneMatch/:id
http://localhost:3000/api/match/deleteMatch/:id
*/