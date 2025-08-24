// src/routes/emergency.routes.js
const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');
const auth = require('../middleware/auth');
const { requirePerm } = require('../middleware/rbac');
const { EmergencyAccess } = require('../models');

// Grant emergency access (for administrators)
router.post('/emergency-access',
  auth,
  requirePerm('manage_users'), // Only admins can grant emergency access
  celebrate({ 
    [Segments.BODY]: Joi.object({
      doctorId: Joi.string().uuid().required(),
      patientId: Joi.string().uuid().optional(),
      reason: Joi.string().required(),
      durationHours: Joi.number().min(1).max(72).default(24)
    }) 
  }),
  async (req, res) => {
    const { doctorId, patientId, reason, durationHours } = req.body;
    
    const endsAt = new Date(Date.now() + durationHours * 60 * 60 * 1000);
    
    const emergencyAccess = await EmergencyAccess.create({
      doctorId,
      patientId,
      reason,
      endsAt
    });
    
    res.status(201).json({
      id: emergencyAccess.id,
      doctorId: emergencyAccess.doctorId,
      patientId: emergencyAccess.patientId,
      reason: emergencyAccess.reason,
      startsAt: emergencyAccess.startsAt,
      endsAt: emergencyAccess.endsAt
    });
  }
);

// List active emergency access (for audit purposes)
router.get('/emergency-access',
  auth,
  requirePerm('manage_users'),
  async (req, res) => {
    const now = new Date();
    const activeAccess = await EmergencyAccess.findAll({
      where: {
        startsAt: { [require('sequelize').Op.lte]: now },
        endsAt: { [require('sequelize').Op.gte]: now }
      },
      include: [{ model: require('../models').User, as: 'doctor', attributes: ['id', 'username', 'role'] }]
    });
    
    res.json({ activeAccess });
  }
);

module.exports = router;