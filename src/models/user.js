const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    username: { type: DataTypes.STRING(120), unique: true, allowNull: false },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    role: { 
      type: DataTypes.ENUM('Patient', 'Nurse', 'Doctor', 'Administrator'),
      allowNull: false
    }
  }, {
    tableName: 'users',
    underscored: true,
    defaultScope: { attributes: { exclude: ['passwordHash'] } },
    scopes: { withSecret: { attributes: { include: ['passwordHash'] } } }
  });

  User.prototype.checkPassword = function (plain) {
    return bcrypt.compare(plain, this.passwordHash);
  };

  return User;
};
