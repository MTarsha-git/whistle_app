module.exports = (sequelize,Datatype)=>{
    const User = sequelize.define("User",{
        userName:{
            type:Datatype.STRING(16),
            allowNull:false
        },
        email:{
            type:Datatype.STRING,
            allowNull:false,
            unique:true,
            validate:{isEmail:true}
        },
        password:{
            type:Datatype.STRING,
            allowNull:false
        },
        phoneNumber:{
            type:Datatype.STRING,
            allowNull:false,
            unique:true,
            validate:{
                isNumeric:true,
                len:[10,15]
            }
        },
        birthDate:{
            type:Datatype.DATEONLY,
            allowNull:false
        },
        address:{
            type:Datatype.STRING,
            allowNull:false
        },
        photo:{
            type:Datatype.STRING,
            allowNull:true,
            //validate:{isUrl:true}
        }

    })
    
    User.associate = models => {
        User.belongsTo(models.Role, {
            onDelete: "cascade"
        });
        User.belongsTo(models.Referee, {
            foreignKey: 'RefereeId',
            onDelete: "cascade"
        });
    }
    return User
}