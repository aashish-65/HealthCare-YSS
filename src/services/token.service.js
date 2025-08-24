const jwt = require('jsonwebtoken');
const { Permission } = require('../models');

async function buildClaims(user) {
  const perms = await Permission.findAll({ where: { role: user.role } });
  return {
    sub: user.id,
    role: user.role,
    permissions: perms.map(p => p.permission)
  };
}

function signToken(claims) {
  const ttl = parseInt(process.env.TOKEN_TTL_SECONDS || '3600', 10);
  return {
    access_token: jwt.sign(claims, process.env.JWT_SECRET, { expiresIn: ttl }),
    expires_in: ttl
  };
}

module.exports = { buildClaims, signToken };
