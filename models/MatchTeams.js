module.exports = (sequelize, DataTypes) => {
  const MatchTeams = sequelize.define('MatchTeams', {
    MatchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Match',
        key: 'id'
      }
    },
    TeamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Team',
        key: 'id'
      }
    }
  }, {
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['MatchId', 'TeamId']
      }
    ]
  });

  return MatchTeams;
};