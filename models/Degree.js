module.exports = (sequelize,Datatype)=>{
    const Degree = sequelize.define("Degree",{
        TypeOfDegree:{
            type:Datatype.STRING,
            allowNull:false
        }
    })
    Degree.associate = models => {
        Degree.hasMany(models.Team, {
            foreignKey: { name: 'DegreeId', allowNull: false },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
        Degree.hasMany(models.Match, {
            foreignKey: { name: 'DegreeId', allowNull: false },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    }
    return Degree
}