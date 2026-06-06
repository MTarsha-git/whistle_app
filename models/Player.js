module.exports = (sequelize,Datatype)=>{
    const Player = sequelize.define("Player",{
        PlayerName:{
            type:Datatype.STRING,
            allowNull:false
        },
        Number:{
            type:Datatype.INTEGER,
            allowNull:false
        },
        YCard:{
            type:Datatype.INTEGER,
            allowNull:false,
            defaultValue:0
            
        },
        RCard:{
            type:Datatype.INTEGER,
            allowNull:true,
            defaultValue:0
        },
        goal:{
            type:Datatype.INTEGER,
            allowNull:true,
            defaultValue:0
        },
        onGoal:{
            type:Datatype.INTEGER,
            allowNull:true,
            defaultValue: 0
        },
        Position:{
            type:Datatype.STRING(4),
            allowNull:true
        },
        Photo:{
            type:Datatype.STRING,
            allowNull:true
        }
    })
    Player.associate = models => {
        Player.belongsTo(models.Team, {
            foreignKey: {name:'TeamId',allowNull:false}
            
        })
        Player.hasMany(models.Event, {
            foreignKey: { name: 'PlayerId', allowNull: false },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    }
    return Player
}