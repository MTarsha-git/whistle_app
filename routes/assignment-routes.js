const express = require("express")
const router = express.Router()
const assignmentController = require("../controllers/assignment-controller")
const checkTimeInWAT = require('../middleware/checkTimeInWAT')
const auth = require('../middleware/auth-maddleware')
const isAdmin = require('../middleware/isAdmin')


router.post("/assigningATaskToReferee",auth,isAdmin,checkTimeInWAT,assignmentController.assigningATaskToReferee)

router.post("/assigningTaskToAssessor",auth,isAdmin,assignmentController.assigningTaskToAssessor)
 
router.delete("/removeAssigningFromRefereeOrAssessor",auth,isAdmin,assignmentController.removeAssigningFromRefereeOrAssessor)

router.get("/getAllRefereeInMatch/:MatchId",auth,isAdmin,assignmentController.getAllRefereeInMatch)

router.get("/getRefereeAssessorToMatch/:MatchId",auth,isAdmin,assignmentController.getRefereeAssessorToMatch)

module.exports = router

/*
my api for assignment:
http://localhost:3000/api/assignment/assigningATaskToReferee
http://localhost:3000/api/assignment/assigningTaskToAssessor
http://localhost:3000/api/assignment/removeAssigningFromRefereeOrAssessor
http://localhost:3000/api/assignment/getAllRefereeInMatch/:MatchId
http://localhost:3000/api/assignment/getRefereeAssessorToMatch/:MatchId

*/ 