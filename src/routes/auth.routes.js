const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');
const { User } = require('../models');
const { buildClaims, signToken } = require('../services/token.service');

router.post('/auth/login',
  celebrate({ [Segments.BODY]: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
  }) }),
  async (req, res) => {
    const { username, password } = req.body;
    const user = await User.scope('withSecret').findOne({ where: { username } });
    if (!user || !(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const claims = await buildClaims(user);
    const token = signToken(claims);
    res.json(token);
  }
);

module.exports = router;
