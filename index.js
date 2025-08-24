require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
const { sequelize } = require('./src/models');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '512kb' }));
app.use(rateLimit({ windowMs: 60_000, max: 120 }));

app.use(require('./src/routes/auth.routes'));
app.use(require('./src/routes/records.routes'));
app.use(require('./src/routes/users.routes'));

app.use(errors());

// Centralized error handler (hide internals)
app.use((err, req, res, next) => {
  console.error(err); // ship to SIEM in prod
  res.status(500).json({ error: 'Internal Server Error' });
});

(async () => {
  // await sequelize.sync();
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`API running on :${port}`));
})();
