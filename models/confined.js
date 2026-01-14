module.exports = (sequelize,Datatype)=>{
    const confined = sequelize.define("confined",{
        Date:{
            type:Datatype.STRING,
            allowNull:true
        },
        Time:{
            type:Datatype.STRING,
            allowNull:true
        },
        CourtId:{
            type:Datatype.INTEGER,
            allowNull:true
        },

    })

    confined.associate = models => {
        confined.belongsTo(models.WAT, {
            foreignKey: { name: 'WATId', allowNull: true },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
        confined.belongsTo(models.Match, {
            foreignKey: { name: 'MatchId', allowNull: true },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    }
    return confined
}