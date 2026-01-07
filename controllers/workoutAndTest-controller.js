const db = require('../models');

// WAT: Workout And Test

const getAllWAT = async (req, res) => {
    const response = await db.WAT.findAll();
    try{
        if(response.length===0){
            return await res.status(404).send({
                message: 'no workouts and tests found'
            });
        }else{
            return await res.status(200).send({
                message: 'all workouts and tests fetched successfully',
                data: response,
            });
        }
    }catch{(err) => {return res.status(400).send(err)}};
};

const getAllTests = async (req, res) => {
    try {
        const tests = await db.WAT.findAll({
            where:{
                TypeActivity: true
            }
        });
        if(tests.length===0){
            return res.status(404).send({
                message: 'no tests found'
            });
        }else{
            return res.status(200).send({
                message: 'all tests fetched successfully',
                data: tests
            });
        }
    } catch (err) {
        return res.status(400).send(err);
    }
};

const getAllWorkouts = async (req, res) => {
    try {
        const workouts = await db.WAT.findAll({where:{
                TypeActivity: false
            }
        });
        if(workouts.length===0){
            return res.status(404).send({
                message: 'no workouts found'
            });
        }else{
            return res.status(200).send({
                message: 'all workouts fetched successfully',
                data: workouts
            });
        }
    }catch (err) {
        return res.status(400).send(err);
    }
};

const getOneWAT = async (req, res) => {
    try {
        const isExisting = await db.WAT.findOne({
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
            const WAT = await db.WAT.findOne({ 
            where: { id: req.params.id },
            include: includeModels 
            });
            if(WAT.TypeActivity===true){
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

// لا بد من التحقق من تعارض مع جدول المباريات قبل الإضافة إذا لزم الأمر
const createWAT = async (req, res) => {
  try {
    const { TypeActivity, Date, Time, CourtId, UserId } = req.body;
    if (TypeActivity === undefined || !Date || !Time || !CourtId || !UserId) {
      return res.status(400).send({ message: 'Missing required fields: TypeActivity, Date, Time, CourtId, UserId' });
    }

    const isReferee = await db.User.findOne({ where: { id: UserId } });
    if (!isReferee) {
      return res.status(404).send({ message: 'User not found' });
    }

    if (isReferee.RoleId !== 3) {
      return res.status(400).send({ message: 'The specified user is not a referee' });
    }

    // Check for existing WAT at the same date for the same user
    const conflict = await db.WAT.findOne({ where: { Date , UserId } });
    if (conflict) {
      return res.status(409).send({ message: 'A WAT already exists for this user at the same date', data: conflict });
    }

    const WAT = await db.WAT.create({ TypeActivity, Date, Time, CourtId, UserId });

    if (WAT.TypeActivity === true) {
      return res.status(201).send({ message: 'test created successfully', data: WAT });
    }

    return res.status(201).send({ message: 'workout created successfully', data: WAT });
  } catch (err) {
    return res.status(400).send({ message: 'Error creating WAT', error: err.message });
  }
};

const updateWAT = async (req, res) => {
  try {
    const WAT = await db.WAT.findOne({ where: { id: req.params.id } });
    if (!WAT) {
      return res.status(404).send({ message: 'WAT not found' });
    }

    // Prepare update fields
    const updateFields = {};
    if (req.body.TypeActivity !== undefined) updateFields.TypeActivity = req.body.TypeActivity;
    if (req.body.Date !== undefined) updateFields.Date = req.body.Date;
    if (req.body.Time !== undefined) updateFields.Time = req.body.Time;
    if (req.body.CourtId !== undefined) updateFields.CourtId = req.body.CourtId;
    if (req.body.UserId !== undefined) updateFields.UserId = req.body.UserId;

    // If UserId is being changed, check referee role
    let userIdToCheck = req.body.UserId !== undefined ? req.body.UserId : WAT.UserId;
    const user = await db.User.findOne({ where: { id: userIdToCheck } });
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    if (user.RoleId !== 3) {
      return res.status(400).send({ message: 'The specified user is not a referee' });
    }

    // Check for conflict (same Date, Time, UserId, but not this WAT)
    if (updateFields.Date || updateFields.UserId) {
      const conflict = await db.WAT.findOne({
        where: {
          Date: updateFields.Date || WAT.Date,
          UserId: updateFields.UserId || WAT.UserId,
          id: { [db.Sequelize.Op.ne]: WAT.id }
        }
      });
      if (conflict) {
        return res.status(409).send({ message: 'A WAT already exists for this user at the same date and time', data: conflict });
      }
    }

    const updatedWAT = await WAT.update(updateFields);
    const freshWAT = await db.WAT.findOne({ where: { id: WAT.id } });
    const msg = freshWAT.TypeActivity === true ? 'Test updated successfully' : 'Workout updated successfully';
    return res.status(200).send({ message: msg, data: freshWAT });
  } catch (err) {
    return res.status(400).send({ message: 'Error updating WAT', error: err.message });
  }
};

const deleteWAT = async(req,res)=>{
    try{
        const WAT = await db.WAT.findOne({ 
            where: {
                id: req.params.id } 
            });
        if(!WAT) {
                return res.status(404).send({
                    message:'not found'
                });  
        }else{
            await WAT.destroy();
            if(WAT.TypeActivity===true){
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
    deleteWAT,
    getAllTests,
    getAllWorkouts
}