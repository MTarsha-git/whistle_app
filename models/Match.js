module.exports = (sequelize,Datatype)=>{
    const Match = sequelize.define("Match",{
        Date:{
            type:Datatype.DATEONLY,
            allowNull:false
        },
        time:{
            type:Datatype.TIME,
            allowNull:false
        },
        MatchType:{
            type:Datatype.BOOLEAN,
            allowNull:false
        }// false for friendly , true for official
    })

    Match.associate = models => {
        Match.belongsTo(models.Court, {
            foreignKey: { name: 'CourtId', allowNull: false },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
        Match.belongsTo(models.Degree, {
            foreignKey: { name: 'DegreeId', allowNull: false },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
        Match.belongsToMany(models.Team, {
            through: models.MatchTeams,
            foreignKey: 'MatchId',
            otherKey: 'TeamId'
        });
        Match.belongsToMany(models.User, {
            through: models.Assignment,
            foreignKey: 'MatchId',
            otherKey: 'UserId'
        });
    }
    return Match    
}
