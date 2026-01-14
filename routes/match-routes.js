const express = require('express');
const router = express.Router();
const matchController = require('../controllers/match-controller');
const notConfinedInMatch = require('../middleware/notConfinedInMatch');
const notConfinedInWAT = require('../middleware/notConfinedInWAT');

router.post('/createMatch', notConfinedInMatch, notConfinedInWAT, matchController.createMatch);

router.get('/getAllMatches', matchController.getMatches);

router.get('/getOneMatch/:id', matchController.getOneMatch);

router.delete('/deleteMatch/:id', matchController.deleteMatch);

module.exports = router;
/*
my api for match:
http://localhost:3000/api/match/createMatch
http://localhost:3000/api/match/getAllMatches
http://localhost:3000/api/match/getOneMatch/:id
http://localhost:3000/api/match/deleteMatch/:id
*/