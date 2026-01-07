const express = require('express')
const router = express.Router()
const testResult = require('../controllers/testResult-controller')

router.get('/getAllTestsResult', testResult.getAllTestsResult);

router.get('/getAllTestsResultForOneReferee/:refereeId', testResult.getAllTestsResultForOneReferee);

router.get('/getOneResultByTestId/:WATId', testResult.getOneResultByTestId);

router.post('/addTestResult', testResult.addTestResult);

router.patch('/updateTestsResult/:id', testResult.updateTestsResult);

router.delete('/deleteTestsResult/:id', testResult.deleteTestsResult);

module.exports = router