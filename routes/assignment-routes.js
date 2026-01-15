const express = require("express")
const router = express.Router()
const assignmentController = require("../controllers/assignment-controller")
const checkTimeInWAT = require('../middleware/checkTimeInWAT')

router.post("/assigningATaskToReferee",checkTimeInWAT,assignmentController.assigningATaskToReferee)

router.post("/assigningTaskToAssessor",assignmentController.assigningTaskToAssessor)

router.delete("/removeAssigningFromRefereeOrAssessor",assignmentController.removeAssigningFromRefereeOrAssessor)

router.get("/getAllRefereeInMatch/:MatchId",assignmentController.getAllRefereeInMatch)

router.get("/getRefereeAssessorToMatch/:MatchId",assignmentController.getRefereeAssessorToMatch)

module.exports = router

/*
my api for assignment:
http://localhost:3000/api/assignment/assigningATaskToReferee
http://localhost:3000/api/assignment/assigningTaskToAssessor
http://localhost:3000/api/assignment/removeAssigningFromRefereeOrAssessor
http://localhost:3000/api/assignment/getAllRefereeInMatch/:MatchId
http://localhost:3000/api/assignment/getRefereeAssessorToMatch/:MatchId

*/ 