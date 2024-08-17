const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    idUser: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    fullName: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    adress: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    noHp: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    gender: {
      type: DataTypes.ENUM('male','female'),
      allowNull: true
    },
    image: {
      type: DataTypes.STRING(225),
      allowNull: true
    },
    auth_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'auth',
        key: 'idAuth'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'user',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idUser" },
        ]
      },
      {
        name: "auth_id",
        using: "BTREE",
        fields: [
          { name: "auth_id" },
        ]
      },
    ]
  });
};
