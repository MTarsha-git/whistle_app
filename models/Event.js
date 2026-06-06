module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define("Event", {
        Time: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        Description: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });
    Event.associate = models => {
        Event.belongsTo(models.TypeOfEvent, {
            foreignKey: { name: 'TypeOfEventId', allowNull: false },
            onDelete: 'CASCADE',    
        });
        Event.belongsTo(models.Match, {
            foreignKey: { name: 'MatchId', allowNull: false },
            onDelete: 'CASCADE',
        });
        Event.belongsTo(models.Player, {
            foreignKey: { name: 'PlayerId', allowNull: false },
            onDelete: 'CASCADE',
        });
        Event.belongsTo(models.Team, {
            foreignKey: { name: 'TeamId', allowNull: false },
            onDelete: 'CASCADE',
        });
    };

    return Event;
};