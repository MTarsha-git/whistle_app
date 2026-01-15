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
        User.hasMany(models.WAT, {
            foreignKey: { name: 'UserId', allowNull: false },
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        });

        User.belongsTo(models.Role, {
            foreignKey: { name: 'RoleId', allowNull: false },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

        User.belongsTo(models.Referee, {
            foreignKey: { name: 'RefereeId', allowNull: true },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
        User.belongsToMany(models.Match, {
            through: models.Assignment,
            foreignKey: 'UserId',
            otherKey: 'MatchId'
        });
        User.hasOne(models.Token, {
            foreignKey: { name: 'UserId', allowNull: false },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    }
    
    return User
}