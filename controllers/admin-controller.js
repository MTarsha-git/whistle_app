const db = require('../models')

// Admin home: simple dashboard stats
const homePageForAdmin = async(req,res) => {
    try{
        const totalForActiveReferees = await db.Referee.count({ where: { status:true } });
        const totalReferees = await db.User.count({ where: { RoleId: 3 } });
        const totalRefereeAssessors = await db.User.count({ where: { RoleId: 2 } });
        const totalMatches = await db.Match.count();
        const totalTeams = await db.Team.count();
        const upcomingMatches = await db.Match.count({ 
            where: { 
                Date: {
                    [db.Sequelize.Op.between]: [new Date(), new Date(new Date().setHours(23,59,59,999))]
                }
            }
        });
        return res.status(200).send({
            message: 'Admin dashboard stats fetched successfully',
            data: {
                totalForActiveReferees,
                totalReferees,
                totalRefereeAssessors,
                totalMatches,
                totalTeams,
                upcomingMatches
            }
        });
    }catch(err){
        return res.status(400).send(err);
    }
};

module.exports = { homePageForAdmin }
