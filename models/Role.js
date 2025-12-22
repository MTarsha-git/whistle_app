module.exports=(sequelize,Datatype)=>{
    const Role = sequelize.define("Role",{
        subject:{
            type:Datatype.STRING(45),  
            allowNull:false
        },

    },{timestamps:false})
       
    
    Role.associate=models=>{
        Role.hasMany(models.User,{
            onDelete:"cascade"
        })
    }

    return Role

}