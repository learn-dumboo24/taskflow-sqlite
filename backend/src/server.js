const app = require('./app');
const { runMigrations } = require('./database/migrations');
const FollowUpScheduler = require('./utils/followUpScheduler');
const config = require('./config/config');

runMigrations();

const scheduler = new FollowUpScheduler();
scheduler.start();

app.listen(config.port, () => {
  console.log(`TaskFlow backend running on port ${config.port}`);
});
