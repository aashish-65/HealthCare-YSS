const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');
const auth = require('../middleware/auth');
const { requirePerm } = require('../middleware/rbac');
const { User } = require('../models');
const bcrypt = require('bcrypt');

// 4. Manage User Accounts (POST /users)
router.post('/users',
  auth,
  requirePerm('manage_users'),
  celebrate({ [Segments.BODY]: Joi.object({
    username: Joi.string().required(),
    role: Joi.string().valid('Patient','Nurse','Doctor','Administrator').required()
  }) }),
  async (req, res) => {
    const { username, role } = req.body;
    const randomPw = cryptoRandom(14);
    const passwordHash = await bcrypt.hash(randomPw, 12);
    const user = await User.create({ username, role, passwordHash });
    // In a real system, send initial password via secure channel (never log plaintext)
    return res.status(201).json({ id: user.id, username: user.username, role: user.role });
  }
);

function cryptoRandom(len) {
  const crypto = require('crypto');
  return crypto.randomBytes(len).toString('base64url');
}

module.exports = router;
