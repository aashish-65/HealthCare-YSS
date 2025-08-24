const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Permission = sequelize.define('Permission', {
    role: {
      type: DataTypes.ENUM('Patient', 'Nurse', 'Doctor', 'Administrator'), primaryKey: true
    },
    permission: { type: DataTypes.STRING, primaryKey: true }
  }, { tableName: 'permissions', timestamps: false, underscored: true });
  return Permission;
};
