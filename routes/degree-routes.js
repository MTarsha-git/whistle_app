const express = require('express');
const router = express.Router();
const degreeController = require('../controllers/degree-controller');

router.post('/createDegree', degreeController.createDegree);

router.get('/getAllDegrees', degreeController.getAllDegrees);

router.get('/getOneDegree/:id', degreeController.getOneDegree);

router.delete('/deleteDegree/:id', degreeController.deleteDegree);

router.patch('/updateDegree/:id', degreeController.updateDegree);

module.exports = router;

/*my api for degree:  
http://localhost:3000/api/degree/createDegree
http://localhost:3000/api/degree/getAllDegrees
http://localhost:3000/api/degree/getOneDegree/:id
http://localhost:3000/api/degree/deleteDegree/:id
http://localhost:3000/api/degree/updateDegree/:id
*/