module.exports = (sequelize,Datatype)=>{
    const Referee = sequelize.define("Referee",{
        degree:{
            type:Datatype.STRING(16),
            allowNull:false
        },
        specification:{
            type:Datatype.STRING,
            allowNull:false,
            validate:{isAlphanumeric:true}
        },
        status:{
            type:Datatype.BOOLEAN,
            allowNull:false
        },
        AFCNumber:{
            type:Datatype.STRING(15),
            allowNull:false,
            unique:true,
            validate:{
                isNumeric:true,
              //  len:[15]
            }
        }
    })
    
    Referee.associate = models => {
        Referee.hasOne(models.User, {
            foreignKey: 'RefereeId',
            onDelete: "CASCADE"
        });
    }
    return Referee
}