const { sequelize, Permission } = require('../models');

const map = {
  Patient: ['view_records'],
  Nurse: ['view_records', 'update_status'],
  Doctor: ['view_records', 'update_status', 'prescribe_medication'],
  Administrator: ['manage_users']
};

(async () => {
  await sequelize.sync();
  const rows = [];
  for (const [role, perms] of Object.entries(map)) {
    perms.forEach(p => rows.push({ role, permission: p }));
  }
  await Permission.destroy({ where: {} });
  await Permission.bulkCreate(rows);
  console.log('Seeded permissions.');
  process.exit(0);
})();
