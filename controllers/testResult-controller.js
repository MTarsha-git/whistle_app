const db = require('../models');


const getAllTestsResult = async (req, res) => {
    const response = await db.TestResult.findAll();
    try{
        if(response.length===0){
            return await res.status(404).send({
                message: 'no tests results found'
            });
        }else{
            return await res.status(200).send({
                message: 'all tests results fetched successfully',
                data: response,
            });
        }
    }catch{(err) => {return res.status(400).send(err)}};
};

const getAllTestsResultForOneUser = async (req, res) => {
    try {
        const getAllTestOfUser = await db.WAT.findAll({
            attributes: ['id'],
            where: { 
                UserId: req.params.UserId,
                TypeActivity: true
            }
        });
        if(getAllTestOfUser.length===0){
            return res.status(404).send({
                message: 'no tests for this user found'
            });
        }
        const ResultOfReferee = await db.TestResult.findAll({
            where:{
                WATId: {
                    [db.Sequelize.Op.in]: getAllTestOfUser.map(test => test.id)
                }
            }
        });
        if(ResultOfReferee.length===0){
            return res.status(404).send({
                message: 'no tests for this referee found'
            });
        }else{
            return res.status(200).send({
                message: 'all tests fetched successfully',
                data: ResultOfReferee
            });
        }
    } catch (err) {
        return res.status(400).send(err);
    }
};

const getOneResultByTestId = async (req, res) => {
    try {
        const WATId = req.params.WATId;
        const isExisting = await db.WAT.findOne({
            where: { id: WATId }
        });
        if (!isExisting) {
            return res.status(404).send({
                message: 'WAT not found'
            });
        } else {
            if (isExisting.TypeActivity !== true) {
                return res.status(400).send({
                    message: 'The specified WAT is not a test it is a workout'
                });
            } else {
                const includeModels = [{ model: db.WAT }];
                const Result = await db.TestResult.findOne({
                    where: { WATId },
                    include: includeModels
                });
                if (!Result) {
                    return res.status(404).send({
                        message: 'The Result for the specified test not found'
                    });
                } else {
                    return res.status(200).send({
                        message: 'TheResult fetched successfully',
                        data: Result
                    });
                }
            }
        }
    } catch (err) {
        return res.status(400).send(err);
    }
};

const addTestResult = async (req, res) => {
    try {
        const isTest = await db.WAT.findOne({ where: { id: req.body.WATId } });
        if (!isTest) {
            return res.status(404).send({ message: 'WAT not found' });
        }

        if (isTest.TypeActivity !== true) {
            return res.status(400).send({ message: 'The specified WAT is not a test it is a workout' });
        }

        const t = await db.sequelize.transaction();
        try {
            const Result = await db.TestResult.create(
                { status: req.body.status, WATId: req.body.WATId },
                { transaction: t }
            );

            const getUserInfo = await db.User.findOne({ where: { id: isTest.UserId }, transaction: t });
            if (!getUserInfo) {
                await t.rollback();
                return res.status(404).send({ message: 'User for the specified WAT not found or deleted' });
            }

            /*if (!getUserInfo.RefereeId) {
                await t.rollback();
                return res.status(400).send({ message: 'No referee associated with the user of this test' });
            }*/

            const editStatusOfReferee = await db.Referee.findOne({ where: { id: getUserInfo.RefereeId }, transaction: t });
            if (!editStatusOfReferee) {
                await t.rollback();
                return res.status(404).send({ message: 'Referee not found' });
            }

            await editStatusOfReferee.update({ status: req.body.status }, { transaction: t });

            await t.commit();
            return res.status(201).send({ message: 'Test Result created successfully and referee status updated', data: Result });
        } catch (innerErr) {
            await t.rollback();
            return res.status(400).send({ message: 'Error creating TestResult', error: innerErr.message });
        }
    } catch (err) {
        return res.status(400).send({ message: 'Error creating TestResult', error: err.message });
    }
};

//the admin can update status or WATId not both
const updateTestsResult = async(req, res ) => {
    try {
        const Result = await db.TestResult.findOne({
            where: { id: req.params.id }
        });
        if(!Result) {
            return res.status(404).send({
                message: 'test result not found'
            });
        }
        if(req.body.WATId!==undefined && req.body.status!==undefined){
            return res.status(405).send({
                message: 'You can not update WATId and status at the same time'
            });
        }
        if(req.body.WATId!==undefined){
            const isTest = await db.WAT.findOne({ where: { id: req.body.WATId } });
            if (!isTest) {
                return res.status(404).send({ message: 'WAT not found' });
            }
            if (isTest.TypeActivity !== true) {
                return res.status(400).send({ message: 'The specified WAT is not a test it is a workout' });
            }
            const getUserInfo = await db.User.findOne({ where: { id: isTest.UserId } });
            if (!getUserInfo) {
                return res.status(404).send({ message: 'User for the specified WAT not found or deleted' });
            }
            if (getUserInfo.RefereeId===3) {
                await Result.update({
                    WATId: req.body.WATId
                });
                return res.status(200).send({ message: 'WATId in Test Result updated successfully', data: Result });
            }else{
                return res.status(400).send({ 
                    message: 'The user associated with this WAT is not a referee'
                });
            }
        }
        if(req.body.status!==undefined){
            const isTest = await db.WAT.findOne({ where: { id: Result.WATId } });
            if (!isTest) {
                return res.status(404).send({ message: 'WAT not found' });
            }

            const getUserInfo = await db.User.findOne({ where: { id: isTest.UserId } });
            if (!getUserInfo) {
                return res.status(404).send({ message: 'User for the specified WAT not found or deleted' });
            }
            const editStatusOfReferee = await db.Referee.findOne({ where: { id: getUserInfo.RefereeId } });
            await editStatusOfReferee.update({ 
                status: req.body.status 
            });
            await Result.update({
                status: req.body.status
            });
            return res.status(200).send({ message: 'Status updated successfully', data: Result });
        }
    }catch (err) {
        return res.status(400).send({
                message: 'Error updating WAT',
                error: err.message
        });
    }
};

const deleteTestsResult = async(req,res)=>{
    try {
        const Result = await db.TestResult.findOne({
            where: { id: req.params.id }
        });
        if(!Result) {
            return res.status(404).send({
                message: 'test result not found'
            });
        }
        await Result.destroy();
        return res.status(200).send({
            message: 'Test Result deleted successfully'
        });
    } catch(err){
            res.status(400).send({
                message:'Error deleting WAT',
                error:err.message
            })
        }  
};

module.exports = {
    getAllTestsResult,
    getOneResultByTestId,
    getAllTestsResultForOneUser,
    addTestResult,
    updateTestsResult,
    deleteTestsResult
}