const { AuditLog } = require('../models');

module.exports = async function audit(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    const userId = req.auth?.user?.id || null;
    const patientId = req.params?.patient_id || null;
    // Log only successful or access attempts to PHI-related routes
    const action = `${req.method} ${req.originalUrl}`;
    AuditLog.create({
      userId, action, resource: action, patientId, timestamp: new Date()
    }).catch(() => {});
  });
  next();
};
