module.exports = (sequelize, Datatype) => {
    const Token = sequelize.define("Token", {
        token: {
            type: Datatype.STRING,
            allowNull: false,
        },
        expiryDate: {
            type: Datatype.DATE,
            allowNull: false,
        },
    });

    Token.associate = models => {
        Token.belongsTo(models.User, {
            foreignKey: { name: 'UserId', allowNull: false },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    }

    return Token;
};