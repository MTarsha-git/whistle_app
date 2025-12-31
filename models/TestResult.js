module.exports = (sequelize,Datatype)=>{
    const TestResult = sequelize.define("TestResult",{
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
    
    TestResult.associate = models => {
        TestResult.belongsTo(models.WAT, {
            foreignKey: { name: 'WATId', allowNull: false },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
       /* User.belongsTo(models.Referee, {
            foreignKey: { name: 'RefereeId', allowNull: true },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });*/
    }  
    return TestResult
}