module.exports = (sequelize, DataTypes) => {
  const Assignment = sequelize.define('Assignment', {
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    MatchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Match',
        key: 'id'
      }
    }
  }, {
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['UserId', 'MatchId']
      }
    ]
  });

  return Assignment;
};