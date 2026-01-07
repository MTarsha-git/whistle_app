module.exports = (sequelize,Datatype)=>{
    const TestResult = sequelize.define("TestResult",{
        status:{
            type:Datatype.BOOLEAN,
            allowNull:false
        }
    })
    
    TestResult.associate = models => {
        TestResult.belongsTo(models.WAT, {
            foreignKey: { name: 'WATId', allowNull: false ,unique:true},
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        })
    }  
    return TestResult
}