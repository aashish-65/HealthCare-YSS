const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');
const auth = require('../middleware/auth');
const audit = require('../middleware/audit');
const { requirePerm, requireSelfOrClinicalStaff } = require('../middleware/rbac');
const { Record, Prescription } = require('../models');

// 1. View Medical Records
router.get('/records/:patient_id',
  auth,
  requirePerm('view_records'),
  requireSelfOrClinicalStaff(),
  audit,
  async (req, res) => {
    const { patient_id } = req.params;
    const records = await Record.findAll({
      where: { patientId: patient_id },
      order: [['createdAt', 'DESC']],
      include: [{ model: Prescription, as: 'prescriptions' }]
    });
    return res.json({ patient_id, records });
  }
);

// 2. Update Patient Status (PATCH /records/{patient_id}/status)
router.patch('/records/:patient_id/status',
  auth,
  requirePerm('update_status'),
  celebrate({ [Segments.BODY]: Joi.object({ status: Joi.string().required() }) }),
  audit,
  async (req, res) => {
    const { patient_id } = req.params;
    const { status } = req.body;
    await Record.create({ patientId: patient_id, data: { type: 'status', status, at: new Date().toISOString() } });
    return res.status(204).send();
  }
);

// 3. Prescribe Medication (POST /records/{patient_id}/prescriptions)
router.post('/records/:patient_id/prescriptions',
  auth,
  requirePerm('prescribe_medication'),
  celebrate({ [Segments.BODY]: Joi.object({
    medication: Joi.string().required(),
    dosage: Joi.string().required()
  }) }),
  audit,
  async (req, res) => {
    const { patient_id } = req.params;
    let rec = await Record.findOne({ where: { patientId: patient_id }, order: [['createdAt', 'DESC']] });
    if (!rec) rec = await Record.create({ patientId: patient_id, data: { type: 'init', at: new Date().toISOString() } });

    const { medication, dosage } = req.body;
    const pr = await Prescription.create({
      recordId: rec.id,
      doctorId: req.auth.user.id,
      medication,
      dosage
    });
    return res.status(201).json(pr);
  }
);

module.exports = router;
