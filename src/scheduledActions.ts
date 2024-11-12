import cron from 'node-cron';

const MIDNIGHT_TIME = '0 0 * * *';

function runDailyTask() {
  console.log('Running daily task...');
}

cron.schedule(MIDNIGHT_TIME, () => {
  runDailyTask();
});
