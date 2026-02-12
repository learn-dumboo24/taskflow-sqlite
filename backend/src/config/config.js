require('dotenv').config();

const config = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'taskflow_dev_secret_change_in_prod',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  dbPath: process.env.DB_PATH || './taskflow.db',
  bcryptSaltRounds: 12,
  followUp: {
    level1AfterDays: 1,
    level2AfterDays: 3,
    level3AfterDays: 7,
    schedulerCron: '0 * * * *', // every hour
  },
};

module.exports = config;
