module.exports.requirePerm = (perm) => {
  return (req, res, next) => {
    const { claims } = req.auth || {};
    if (!claims || !Array.isArray(claims.permissions)) return res.status(403).json({ error: 'Forbidden' });
    if (!claims.permissions.includes(perm)) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
};

// Extra check for "Patient can only see their own records"
module.exports.requireSelfOrClinicalStaff = () => {
  return (req, res, next) => {
    const { user, emergency } = req.auth;
    const targetPatientId = req.params.patient_id;

    if (user.role === 'Patient') {
      if (user.id !== targetPatientId) return res.status(403).json({ error: 'Patients may only access their own records' });
      return next();
    }
    // Nurse or Doctor can view; if Doctor without standard permission, emergency window may allow
    if (user.role === 'Nurse' || user.role === 'Doctor') {
      // Optional: restrict emergency to specific patient
      if (user.role === 'Doctor' && !req.auth.claims.permissions.includes('view_records')) {
        if (!emergency) return res.status(403).json({ error: 'No emergency access' });
        if (emergency.patientId && emergency.patientId !== targetPatientId) {
          return res.status(403).json({ error: 'Emergency access not granted for this patient' });
        }
      }
      return next();
    }
    return res.status(403).json({ error: 'Forbidden' });
  };
};
