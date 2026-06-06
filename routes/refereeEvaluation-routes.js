const express = require('express');
const router = express.Router();
const RefereeEvaluationController = require('../controllers/refereeEvaluation-controller');
const auth = require('../middleware/auth-maddleware');
const isAdmin = require('../middleware/isAdmin');
const isAssessorOrAdmin = require('../middleware/isAssessorOrAdmin');

router.use(auth);

router.post('/createRefereeEvaluation',isAssessorOrAdmin,RefereeEvaluationController.createRefereeEvaluation)
router.get('/getRefereeEvaluationsByMatch/:MatchId',isAdmin,RefereeEvaluationController.getRefereeEvaluationsByMatch)
router.get('/getAllEvaluationsByUser/:UserId',isAdmin,RefereeEvaluationController.getAllEvaluationsByUser)
router.delete('/deleteRefereeEvaluation/:id',isAdmin,RefereeEvaluationController.deleteRefereeEvaluation)

module.exports = router;