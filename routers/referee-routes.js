const express = require("express")
const router = express.Router()
const db = require("../models/Referee")

router.patch('/updateInfo/:id',async (req,res) => {
    try {
        const referee = await db.Referee.findOne({ where: { id: req.params.id } });
        if (!referee) {
             res.status(404).send({ message: 'Referee not found' });
        }else{
            await referee.update({
                degree: req.body.degree,
                specification: req.body.specification,
                status: req.body.status,
                AFCNumber: req.body.AFCNumber
                
            });
            res.status(200).send({ message: 'Referee updated successfully' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error updating referee info', error });
    }
})


module.exports = router;
