module.exports = (sequelize,Datatype)=>{
    const WAT = sequelize.define("WAT",{
        Date:{
            type:Datatype.DATEONLY,
            allowNull:false,    
        },
        Time:{
            type:Datatype.TIME,
            allowNull:false
        },
        TypeActivity:{
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
        WAT.belongsTo(models.User, {
            foreignKey: { name: 'UserId', allowNull: false },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
        WAT.hasOne(models.TestResult, {
            foreignKey: { name: 'WATId', allowNull: false },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    }  
    return WAT
}