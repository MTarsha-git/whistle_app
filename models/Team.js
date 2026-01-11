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
        Degree:{
            type:Datatype.STRING,
            allowNull:true
        },
        Players:{
            type:Datatype.JSON,
            allowNull:false
        },//[{name:mohammad,num:19,sub:35,YCard:45,RCard:35,goal:34,onGoal:1,position:gk},{} ] 
        TeamLogo:{
            type:Datatype.STRING,
            allowNull:true
        }
    })


    return Team
}