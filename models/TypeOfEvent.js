module.exports = (sequelize, DataTypes) => {
    const TypeOfEvent = sequelize.define("TypeOfEvent", {
        EventName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    })
    TypeOfEvent.associate = models => {
        TypeOfEvent.hasMany(models.Event, {
            foreignKey: { name: 'TypeOfEventId', allowNull: false },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    }
    return TypeOfEvent;
}