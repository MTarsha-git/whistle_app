const db = require('../models');

//WAT stand for Workout And Test

const getAllWAT = (req,res)=>{
    db.WorkoutAndTest.findAll()
    .then((response)=>
        res.status(200).send({
            message: 'all workouts and tests fetched successfully',
            data: response
    }))
    .catch((err)=>res.status(400).send(err))
};

const getOneWAT = async (req, res) => {
    try {
        const isExisting = await db.WorkoutAndTest.findOne({
            where: { id: req.params.id }
        });
        if (!isExisting) {
            return res.status(404).send({
                message: 'WAT not found'
            });
        }else{     
            const includeModels = [
             { model: db.Court, as: 'Court' },
             { model: db.User, as: 'User' }
            ];  
            const WAT = await db.WorkoutAndTest.findOne({ 
            where: { id: req.params.id },
            include: includeModels 
            });
            if(WAT.Type===true){
                return res.status(200).send({
                    message: 'test fetched successfully',
                    data: WAT
                });
            }else{
                return res.status(200).send({
                    message: 'workout fetched successfully',
                    data: WAT
                });
            }
    }} catch (err) {
        return res.status(400).send(err);
    }
};
//لازم نتفقد جدول المباريات اذا في تعارض مع التمرين او الاختبار
const createWAT = async (req, res) => {
         try {
            const WAT = await db.WorkoutAndTest.create({
              Type: req.body.Type,
              Date: req.body.Date,
              Time : req.body.Time,
              CourtId: req.body.CourtId,
              UserId: req.body.UserId
            });
            if(WAT.Type===true){
                return res.status(200).send({
                    message: 'test created successfully',
                    data: WAT
                });
            }else{
                return res.status(200).send({ 
                    message:'workout created successfully',
                    data: WAT
                });
            } 
        }catch (err) {
            res.status(400).send({ 
                message: 'Error creating WAT',
                error: err.message
            });
  }
};

const updateWAT = async(req, res ) => {
    try {
        const WAT = await db.WorkoutAndTest.findOne({
            where: { id: req.params.id }
        });
        if (!WAT) {
            if(WAT.Type===true){
                return res.status(404).send({
                    message: 'Test not found'
                });
            }
            else{
                return res.status(404).send({
                    message: 'Workout not found'
                });
            }
        }else{
            await WAT.update({
              Type: req.body.Type,
              Date: req.body.Date,
              Time : req.body.Time,
              CourtId: req.body.CourtId,
              UserId: req.body.UserId
            });
            if(WAT.Type===true){
                return res.status(200).send({
                    message: 'Test updated successfully',
                    data: WAT
                });
            }
            else{
                return res.status(200).send({
                    message: 'Workout updated successfully',
                    data: WAT
                });
            }
        }
    } catch (err) {
        return res.status(400).send({
                message: 'Error updating WAT',
                error: err.message
        });
    }
};

const deleteWAT = async(req,res)=>{
    try{
        const WAT = await db.WorkoutAndTest.findOne({ where: { id: req.params.id } });
        if (!WAT) {
            if(WAT.Type===true){
                return res.status(404).send({message:'Test not found'});
            }else{
                return res.status(404).send({message:'Workout not found'});
            }   
        }else{
            await WAT.destroy();
            if(WAT.Type===true){
                return  res.status(200).send({
                    message:'Test deleted successfully',
                    data:WAT
                });
            }else{
                return  res.status(200).send({
                    message:'Workout deleted successfully',
                    data:WAT
                });
            }
        }
    } catch(err){
            res.status(400).send({
                message:'Error deleting WAT',
                error:err.message
            })
        }  
};

module.exports = {
    getAllWAT,
    getOneWAT,
    createWAT,
    updateWAT,
    deleteWAT
    //getAllTests,
    //getAllWorkouts
}