import app from './app';
import { runMigrations } from './database/migrations';
import FollowUpScheduler from './utils/followUpScheduler';
import config from './config/config';

runMigrations();

const scheduler = new FollowUpScheduler();
scheduler.start();

app.listen(config.port, () => {
  console.log(`TaskFlow backend running on port ${config.port}`);
});
