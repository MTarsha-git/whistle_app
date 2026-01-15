const express = require("express")
const router = express.Router()
const assignmentController = require("../controllers/assignment-controller")
const checkTimeInWAT = require('../middleware/checkTimeInWAT')

router.post("/assigningATaskToReferee",checkTimeInWAT,assignmentController.assigningATaskToReferee)

module.exports = router

/*
my api for assignment:
http://localhost:3000/api/assignment/assigningATaskToReferee

*/ 