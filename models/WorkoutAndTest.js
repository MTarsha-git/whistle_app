module.exports = (sequelize,Datatype)=>{
    const WAT = sequelize.define("WAT",{
        DateAndTime:{
            type:Datatype.DATE,
            allowNull:false
        },
        Type:{
            type:Datatype.BOOLEAN,
            allowNull:false,
            // true for test, false for workout
        },
    })
    
    WAT.associate = models => {
        WAT.belongsTo(models.Court, {
            foreignKey: { name: 'CourtId', allowNull: false },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
        WAT.hasOne(models.TestResult, {
            foreignKey: { name: 'WATId', allowNull: true },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    }  
    return WAT
}