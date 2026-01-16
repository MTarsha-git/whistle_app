const express = require('express')
const router = express.Router()
const testResult = require('../controllers/testResult-controller')
const auth = require('../middleware/auth-maddleware')
const isAdmin = require('../middleware/isAdmin')
// All routes protected and only accessible by admin users
router.use(auth)
router.use(isAdmin)

router.get('/getAllTestsResult', testResult.getAllTestsResult);

router.get('/getAllTestsResultForOneUser/:UserId', testResult.getAllTestsResultForOneUser);

router.get('/getOneResultByTestId/:WATId', testResult.getOneResultByTestId);

router.post('/addTestResult', testResult.addTestResult);

router.patch('/updateTestsResult/:id', testResult.updateTestsResult);

router.delete('/deleteTestsResult/:id', testResult.deleteTestsResult);

module.exports = router

/*my api for testResult:
http://localhost:3000/api/testResult/getAllTestsResult
http://localhost:3000/api/testResult/getAllTestsResultForOneUser/:UserId    
http://localhost:3000/api/testResult/getOneResultByTestId/:WATId
http://localhost:3000/api/testResult/addTestResult
http://localhost:3000/api/testResult/updateTestsResult/:id
http://localhost:3000/api/testResult/deleteTestsResult/:id  */