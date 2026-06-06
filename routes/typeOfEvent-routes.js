const express = require('express');
const router = express.Router();
const typeOfEventController = require('../controllers/typeOfEvent-controller');
const auth = require('../middleware/auth-maddleware');
const isAdmin = require('../middleware/isAdmin');   

// All routes protected and only accessible by admin users
router.use(auth);
router.use(isAdmin);

router.post('/createTypeOfEvent', typeOfEventController.createTypeOfEvent);
router.get('/getTypeOfEvents', typeOfEventController.getTypeOfEvents);
router.get('/getTypeOfEventById/:id', typeOfEventController.getTypeOfEventById);
router.delete('/deleteTypeOfEvent/:id', typeOfEventController.deleteTypeOfEvent);
router.patch('/updateTypeOfEvent/:id', typeOfEventController.updateTypeOfEvent);

module.exports = router;

//api endpoints for type of event
// http://localhost:3000/api/typeOfEvent/createTypeOfEvent
// http://localhost:3000/api/typeOfEvent/getTypeOfEvents
// http://localhost:3000/api/typeOfEvent/getTypeOfEventById/:id
// http://localhost:3000/api/typeOfEvent/deleteTypeOfEvent/:id
// http://localhost:3000/api/typeOfEvent/updateTypeOfEvent/:id