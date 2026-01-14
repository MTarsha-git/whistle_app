module.exports = (sequelize, DataTypes) => {
  const MatchTeams = sequelize.define('MatchTeams', {
    MatchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Matches',
        key: 'id'
      }
    },
    TeamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Teams',
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