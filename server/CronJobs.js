var cron = require('node-cron');
const UserController = require('./controllers/UserController');

class CronJobs {

    startParsingJob() {
        // выполняется каждые 30 секунд
        cron.schedule('*/30 * * * * *', () => {
            UserController.cronTest();
        });
    }
}

module.exports = new CronJobs(); 