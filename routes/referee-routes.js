const express = require("express")
const router = express.Router()
const referee = require("../controllers/referee-controller")
const auth = require("../middleware/auth-maddleware")
const isReferee = require("../middleware/isReferee")
const isAdmin = require("../middleware/isAdmin")

router.patch('/updateInfo/:id',auth,isReferee,referee.updateReferee);
// عندما اريد حذف المستخدم الحكم يجب الحذف عن طريق هذا الراوت 
router.delete('/deleteOne/:id',auth,isAdmin,referee.deleteOne);

router.get('/homePage',auth,isReferee,referee.homePageForReferee);

module.exports = router;
/*
my api endpoints:
http://localhost:3000/api/referee/updateInfo/:id -->PATCH  send {name,phone} in body
http://localhost:3000/api/referee/deleteOne/:id -->DELETE
http://localhost:3000/api/referee/homePage -->GET


*/