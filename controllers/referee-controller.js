const db = require("../models")

const updateReferee = async (req,res) => {
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
};

// عندما اريد حذف المستخدم الحكم يجب الحذف عن طريق هذا الراوت 
const deleteOne = async (req, res) => {
    try {
        const referee = await db.Referee.findOne({ where: { id: req.params.id } });
        if (!referee) {
            res.status(404).send({ message: 'Referee not found' });
        } else {
            await referee.destroy();
            res.status(200).send({ message: 'Referee deleted successfully' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error deleting referee', error });
    }
};
module.exports = {
updateReferee,
deleteOne
}