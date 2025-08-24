const { DataTypes } = require('sequelize');
const { encryptJSON, decryptJSON } = require('../config/security');

module.exports = (sequelize) => {
  const Record = sequelize.define('Record', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    patientId: { type: DataTypes.UUID, allowNull: false },
    data: { // encrypted PHI blob
      type: DataTypes.TEXT, allowNull: false,
      get() {
        const raw = this.getDataValue('data');
        return raw ? decryptJSON(raw) : null;
      },
      set(val) {
        this.setDataValue('data', encryptJSON(val));
      }
    },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  }, { tableName: 'records', underscored: true, updatedAt: false });

  return Record;
};
