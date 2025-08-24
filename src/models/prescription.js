const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const Prescription = sequelize.define('Prescription', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    recordId: { type: DataTypes.UUID, allowNull: false },
    doctorId: { type: DataTypes.UUID, allowNull: false },
    medication: { type: DataTypes.STRING, allowNull: false },
    dosage: { type: DataTypes.STRING, allowNull: false }
  }, { tableName: 'prescriptions', underscored: true });
  return Prescription;
};
