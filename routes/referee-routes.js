const express = require("express")
const router = express.Router()
const referee = require("../controllers/referee-controller")

router.patch('/updateInfo/:id',referee.updateReferee);
// عندما اريد حذف المستخدم الحكم يجب الحذف عن طريق هذا الراوت 
router.delete('/deleteOne/:id',referee.deleteOne);

module.exports = router;
