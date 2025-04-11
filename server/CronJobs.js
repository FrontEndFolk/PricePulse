var cron = require('node-cron');
const UserController = require('./controllers/UserController');

class CronJobs {

    startParsingJob() {
        // выполняется каждые 5 секунд
        cron.schedule('*/5 * * * * *', () => {
            UserController.cronTest();
        });
    }
}

module.exports = new CronJobs(); 