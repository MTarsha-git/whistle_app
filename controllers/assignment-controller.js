const db = require('../models');


const assigningATaskToReferee = async (req, res) => {
    try {
        const { MatchId, UserId } = req.body; // add Task could be 'Main Referee', 'Assistant Referee', etc.
        // Validate input
        if (!MatchId || !UserId) {
            return res.status(400).send({ message: 'MatchId and UserId are required' });
        }
        // Check if Match exists
        const matchCreated = await db.Match.findByPk(MatchId);
        if (!matchCreated) {
            return res.status(404).send({ message: 'Match not found' });
        }
        // Check if this referee is already assigned to this match
        const existingAssignment = await db.Assignment.findOne({ where: { MatchId, UserId } });
        if (existingAssignment) {
            return res.status(400).send({ message: 'This referee is already assigned to this match' });
        }
        // Check maximum assignments for the match
        const countOfAssignments = await db.Assignment.count({ where: { MatchId,isAssessor:false } });
        if (countOfAssignments >= 4) {
            return res.status(400).send({ message: 'Maximum assignments reached for this match' });
        }// Check if User exists and is a referee
        const isReferee = await db.User.findOne(
            { where: { RoleId: 3 , id:UserId } });
        if (!isReferee) {
            return res.status(404).send({ message: 'User is not a referee' });
        }
        // Check if referee is active
        if(isReferee.RefereeId.status == false){
            return res.status(400).send({ message: 'This referee is currently inactive' });
        }
        // Check for conflicting WAT (test) on the same date
        const hasTest = await db.WAT.findOne({
            where: { UserId: UserId, Date: matchCreated.Date, TypeActivity: true }
        });
        if (hasTest) {
            return res.status(400).send({ message: 'Referee has a test on the same date as the match' });
        }
        // Check maximum assignments for the referee on the same date
        const idsOfMatchesInDate = await db.Match.findAll({
            where: { Date: matchCreated.Date },
            attributes: ['id']
        });
        // Count assignments of the referee on that date
        const countAssignmentsOfRefereeInDate = await db.Assignment.count({
            where: {
                UserId: UserId,
                MatchId: { [db.Sequelize.Op.in]: idsOfMatchesInDate.map(m => m.id) }
            }
        });
        const hasWorkout = await db.WAT.findOne({
            where: { UserId: UserId, Date: matchCreated.Date, TypeActivity: false }
        });
        if (hasWorkout) {
            if (countAssignmentsOfRefereeInDate >= 1) {
                return res.status(400).send({ message: 'Referee already has one assignments on the same date' });
            }
            const newAssignment = await db.Assignment.create({MatchId,UserId})
            return res.status(200).send({
                message:"an assignment is created ",
                data:newAssignment
            })
        }

        if (countAssignmentsOfRefereeInDate >= 1) {
            return res.status(400).send({ message: 'Referee already has one assignment on the same date' });
        }
        const AllAssignmentsOfRefereeInDate = await db.Assignment.findAll({
            where: {
                UserId: UserId,
                MatchId: { [db.Sequelize.Op.in]: idsOfMatchesInDate.map(m => m.id) }
            }
        });
        if(AllAssignmentsOfRefereeInDate.length==0){
            const newAssignment = await db.Assignment.create({MatchId,UserId})
                return res.status(200).send({
                message:"an assignment is created for Referee",
                data:newAssignment
            })
        }
        await db.Assignment.create({ MatchId, UserId });
        return res.status(201).send({ message: 'Assignment created successfully' });
    } catch (err) {
        return res.status(400).send(err);
    }
};

const assigningTaskToAssessor = async(req, res) => {
    try {
        const { MatchId, UserId } = req.body; // add Task could be 'Main Referee', 'Assistant Referee', etc.
        // Validate input
        if (!MatchId || !UserId ) {
            return res.status(400).send({ message: 'MatchId and UserId are required' });
        }
        // Check if Match exists
        const matchCreated = await db.Match.findByPk(MatchId);
        if (!matchCreated) {
            return res.status(404).send({ message: 'Match not found' });
        }
        // Check if this referee is already assigned to this match
        const existingAssignment = await db.Assignment.findOne({ where: { MatchId, UserId } });
        if (existingAssignment) {
            return res.status(400).send({ message: 'This referee assessor is already assigned to this match' });
        }
        // Check maximum assignments for the match
        const countOfAssignments = await db.Assignment.count({ where: { MatchId,isAssessor:true } });
        if (countOfAssignments >= 1) {
            return res.status(400).send({ message: 'Maximum assignments reached for this match' });
        }// Check if User exists and is a referee assessor
        const RefereeAssessor = await db.User.findOne({ where: { RoleId: 2 , id:UserId
        } });
        if (!RefereeAssessor) {
            return res.status(404).send({ message: 'User is not a referee assessor' });
        }
        const assigningAssessor = db.Assignment.create({
            MatchId,
            UserId,
            isAssessor:true
        })
        return res.status(201).send({
            message:"an assignment is created for Referee Assessor"
        })

    }catch (err) {
        return res.status(400).send(err);
    }
};

const removeAssigningFromRefereeOrAssessor = async(req, res) => {
    try{
        const {MatchId,UserId}=req.body;
        if (!MatchId || !UserId) {
            return res.status(400).send({ message: 'MatchId and UserId are required' });
        }
        const existingAssignment = await db.Assignment.findOne({ where: { MatchId, UserId } });
        if (!existingAssignment) {
            return res.status(400).send({ message: 'assignment not found' });
        }
        await db.Assignment.destroy({ where: { MatchId, UserId } });
            return res.status(200).send({ message: 'an assignment is removed' });
    } catch(err){
         return res.status(400).send(err);
    }
};

const getAllRefereeInMatch = async(req, res) => {
    try{
        const allReferees = await db.Assignment.findAll({ where: { MatchId: req.params.MatchId,isAssessor:false } });
        
        if (allReferees.length === 0) {
            return res.status(404).send({ message: 'No referee found for this match' });
        }
        return res.status(200).send(allReferees);

    } catch(err){
        return res.status(400).send(err)
    }
};

const getRefereeAssessorToMatch = async(req, res) => {
    try{
        const RefereeAssessor = await db.Assignment.findOne({ 
                    where: { MatchId: req.params.MatchId,
                        isAssessor:true
                     }
        });
        if (!RefereeAssessor) {
            return res.status(404).send({ message: 'No referee assessor found for this match' });
        }
        return res.status(200).send(RefereeAssessor);

    } catch(err){
        return res.status(400).send(err)
    }
};


module.exports ={
    assigningATaskToReferee,
    assigningTaskToAssessor,
    removeAssigningFromRefereeOrAssessor,
    getAllRefereeInMatch,
    getRefereeAssessorToMatch


}