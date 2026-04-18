import dotenv from 'dotenv';
dotenv.config();

interface Config {
  port: number;
  jwtSecret: string;
  jwtExpiresIn: string;
  dbPath: string;
  bcryptSaltRounds: number;
  followUp: {
    level1AfterDays: number;
    level2AfterDays: number;
    level3AfterDays: number;
    schedulerCron: string;
  };
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  jwtSecret: process.env.JWT_SECRET || 'taskflow_dev_secret_change_in_prod',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  dbPath: process.env.DB_PATH || './taskflow.db',
  bcryptSaltRounds: 12,
  followUp: {
    level1AfterDays: 1,
    level2AfterDays: 3,
    level3AfterDays: 7,
    schedulerCron: '0 * * * *',
  },
};

export default config;
