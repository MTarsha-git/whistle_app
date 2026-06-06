module.exports = (sequelize, DataTypes) => {
    const RefereeEvaluation = sequelize.define("RefereeEvaluation", {
        Evaluation: { 
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
                max: 10}
            },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });
    RefereeEvaluation.associate = models => {
        RefereeEvaluation.belongsTo(models.User, {
            foreignKey: { name: 'UserId', allowNull: false },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
        RefereeEvaluation.belongsTo(models.Match, {
            foreignKey: { name: 'MatchId', allowNull: false },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    };
    return RefereeEvaluation;
}
       

