const { sequelize } = require('../config/database');
const User = require('./user')(sequelize);
const Record = require('./record')(sequelize);
const Permission = require('./permission')(sequelize);
const AuditLog = require('./auditLog')(sequelize);
const EmergencyAccess = require('./emergencyAccess')(sequelize);
const Prescription = require('./prescription')(sequelize);

// Associations
// A patient (User with role Patient) owns Records
User.hasMany(Record, { as: 'patientRecords', foreignKey: 'patientId' });
Record.belongsTo(User, { as: 'patient', foreignKey: 'patientId' });

// Prescriptions belong to a Record and a Doctor (User)
Record.hasMany(Prescription, { as: 'prescriptions', foreignKey: 'recordId' });
Prescription.belongsTo(Record, { as: 'record', foreignKey: 'recordId' });
User.hasMany(Prescription, { as: 'doctorPrescriptions', foreignKey: 'doctorId' });
Prescription.belongsTo(User, { as: 'doctor', foreignKey: 'doctorId' });

// Permissions: simple role->permission mapping (no user-level overrides)
Permission.removeAttribute('id'); // composite PK by role+permission
Permission.primaryKeyAttributes = ['role', 'permission'];

// Audit logs
User.hasMany(AuditLog, { as: 'audits', foreignKey: 'userId' });
AuditLog.belongsTo(User, { as: 'user', foreignKey: 'userId' });

// Emergency Access windows belong to a Doctor user
User.hasMany(EmergencyAccess, { as: 'emergencyGrants', foreignKey: 'doctorId' });
EmergencyAccess.belongsTo(User, { as: 'doctor', foreignKey: 'doctorId' });

module.exports = { sequelize, User, Record, Permission, AuditLog, EmergencyAccess, Prescription };
