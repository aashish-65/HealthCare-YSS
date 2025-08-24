const jwt = require('jsonwebtoken');
const { User, EmergencyAccess } = require('../models');
const { Op } = require('sequelize');

module.exports = async function auth(req, res, next) {
  try {
    const hdr = req.headers.authorization || '';
    const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Missing token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user + claims
    const user = await User.findByPk(decoded.sub);
    if (!user) return res.status(401).json({ error: 'Invalid user' });

    // Check any active emergency access window for Doctor
    let emergency = null;
    if (user.role === 'Doctor') {
      const now = new Date();
      emergency = await EmergencyAccess.findOne({
        where: { doctorId: user.id, startsAt: { [Op.lte]: now }, endsAt: { [Op.gte]: now } }
      });
    }

    req.auth = { user, claims: decoded, emergency };
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
