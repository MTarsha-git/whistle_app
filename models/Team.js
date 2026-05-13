module.exports = (sequelize,Datatype)=>{
    const Team = sequelize.define("Team",{
        TeamName:{
            type:Datatype.STRING,
            allowNull:false,
            unique:true
        },
        TeamManager:{
            type:Datatype.STRING,
            allowNull:false
        },
        Coach:{
            type:Datatype.STRING,
            allowNull:false
        },
        AssistantCoach:{
            type:Datatype.STRING,
            allowNull:true
        },
        KeeperCoach:{
            type:Datatype.STRING,
            allowNull:true
        },
        PhysicalTherapist:{
            type:Datatype.STRING,
            allowNull:true
        },
        MediaOfficial:{
            type:Datatype.STRING,
            allowNull:true
        },
        EquipmentManager:{
            type:Datatype.STRING,
            allowNull:true
        }, 
        TeamLogo:{
            type:Datatype.STRING,
            allowNull:true
        }
    })
    Team.associate = models => {
        Team.hasMany(models.Player, {
            foreignKey: {name: 'TeamId' , allowNull: false},
        });
        Team.belongsTo(models.Degree, {
            foreignKey: { name: 'DegreeId', allowNull: false },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
        Team.belongsToMany(models.Match, {
            through: models.MatchTeams,
            foreignKey: 'TeamId',
            otherKey: 'MatchId'
        });
    }

    return Team
}