module.exports = (sequelize,Datatype)=>{
    const Match = sequelize.define("Match",{
        Date:{
            type:Datatype.DATE,
            allowNull:false
        },
        time:{
            type:Datatype.TIME,
            allowNull:false
        },
        Type:{
            type:Datatype.BOOLEAN,
            allowNull:false
        },// false for friendly , true for official
        
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
    }
    return Match    
}
