module.exports = (sequelize,Datatype)=>{
    const Court = sequelize.define("Court",{
        courtName:{
            type:Datatype.STRING,
            allowNull:false
        },
        address:{
            type:Datatype.STRING,
            allowNull:false
        }
    })
    
    Court.associate = models => {
        Court.hasMany(models.WAT, {
            foreignKey: { name: 'CourtId', allowNull: false },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    }
    return Court
}