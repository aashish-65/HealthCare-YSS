require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
const { sequelize } = require('./src/models');
// const { errorHandler } = require('./src/middleware/errorHandler');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '512kb' }));
app.use(rateLimit({ windowMs: 60_000, max: 120 }));

app.use(require('./src/routes/auth.routes'));
app.use(require('./src/routes/records.routes'));
app.use(require('./src/routes/users.routes'));
app.use(require('./src/routes/emergency.routes'));

// Use celebrate's error handler first
app.use(errors());

// Then use your custom error handler
// app.use(errorHandler);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
    // await sequelize.sync(); // Uncomment for development
    
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`API running on :${port}`));
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
})();