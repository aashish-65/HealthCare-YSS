const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const EmergencyAccess = sequelize.define('EmergencyAccess', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    doctorId: { type: DataTypes.UUID, allowNull: false },
    // Optional: limit to particular patient or wildcard "*"
    patientId: { type: DataTypes.UUID, allowNull: true },
    reason: { type: DataTypes.STRING, allowNull: false },
    startsAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    endsAt: { type: DataTypes.DATE, allowNull: false }
  }, { tableName: 'emergency_access', underscored: true });
  return EmergencyAccess;
};
