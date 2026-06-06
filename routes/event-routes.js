const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event-controller');
const auth = require('../middleware/auth-maddleware');

router.use(auth);

router.post('/createEvent', eventController.createEvent);
router.get('/getAllEventsForMatch/:MatchId', eventController.getAllEventsForMatch);
router.get('/getAllEventsForTeamInMatch/:MatchId/:TeamId', eventController.getAllEventsForTeamInMatch);
router.get('/getAllEventsForPlayerInMatch/:MatchId/:PlayerId', eventController.getAllEventsForPlayerInMatch);
router.delete('/deleteEvent/:id', eventController.deleteEvent);

module.exports = router;

//my api endpoints are :
//http://localhost:3000/api/event/createEvent
//http://localhost:3000/api/event/getAllEventsForMatch/:MatchId
//http://localhost:3000/api/event/getAllEventsForTeamInMatch/:MatchId/:TeamId
//http://localhost:3000/api/event/getAllEventsForPlayerInMatch/:MatchId/:PlayerId
//http://localhost:3000/api/event/deleteEvent/:id 