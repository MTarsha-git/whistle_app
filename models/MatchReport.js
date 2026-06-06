module.exports = (sequelize, DataTypes) => {
    const MatchReport = sequelize.define("MatchReport", {
        Round: {
            type: DataTypes.STRING,
            allowNull: false
        },
        FHResult: {
            type: DataTypes.STRING,
            allowNull: false
        },
        SHResult: {
            type: DataTypes.STRING,
            allowNull: false
        },
        FinalResult: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    MatchReport.associate = models => {
        MatchReport.belongsTo(models.Match, {
            foreignKey: { name: 'MatchId', allowNull: false },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    };

    return MatchReport;
}