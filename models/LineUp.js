module.exports = (sequelize,Datatype)=>{
    const LineUp = sequelize.define("LineUp",{
        ParticipatingPlayers:{
            type:Datatype.JSON,
            allowNull:true,
            defaultValue: []
        },
        substitutePlayers:{
            type:Datatype.JSON,
            allowNull:true,
            defaultValue: []
        },
        kitColor:{
            type:Datatype.STRING,
            allowNull:true
        },
        shortColor:{
            type:Datatype.STRING,
            allowNull:true
        },
        socksColor:{
            type:Datatype.STRING,
            allowNull:true
        }
        
    })
    LineUp.associate = models => {
        LineUp.belongsTo(models.Team, {
            foreignKey: { name: 'TeamId', allowNull: false },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
        LineUp.belongsTo(models.Match, {
            foreignKey: { name: 'MatchId', allowNull: false },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

    }
    return LineUp
}
