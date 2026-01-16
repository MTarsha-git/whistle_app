const db = require("../models");
const { all } = require("../routes/role-routes");

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

const homePageForReferee = async(req,res) => {
    try{
        const allTests = await db.WAT.findAll({ where: { UserId: req.user.id ,TypeActivity:true},attributes: ['id'] });
        const allResults = await db.WATResult.findAll({ where: { 
            WATId:
            { [db.Sequelize.Op.in]: allTests.map(test => test.id)}
          } });
        const totalWorkoutsForReferee = await db.WAT.count({ where: { UserId: req.user.id ,TypeActivity:false} });
        const totalTestsForReferee = await db.WAT.count({ where: { UserId: req.user.id ,TypeActivity:true} });
        const totalAssignedMatches = await db.Assignment.count({ where: { UserId: req.user.id,isAssessor:false } });
        return res.status(200).send({
            message: 'Referee dashboard stats fetched successfully',
            data: {
                totalAssignedMatches,
                totalWorkoutsForReferee,
                totalTestsForReferee,
                allResults
            }
        });
    }catch(err){
        return res.status(400).send(err);
    }
};

module.exports = {
updateReferee,
deleteOne,
homePageForReferee
}