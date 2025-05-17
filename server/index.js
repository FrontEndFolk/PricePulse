const express = require('express')
const cors = require('cors');
const port = 3000

const { default: mongoose } = require('mongoose');
const uri = "mongodb+srv://admin:admin@pricenotifyer.qomwx.mongodb.net/sample_mflix?retryWrites=true&w=majority&appName=PriceNotifyer";

const parser = require('./modules/parsingModule');
const router = require("./routes/index");
const cronJobs = require("./CronJobs");

const app = express()
app.use(cors());
app.use("/", router);
app.get('/', async (req, res) => {
    res.send('Hello World!')
})

async function start() {
    try {
        await mongoose.connect(uri, {});
        app.listen(port, () => {
            console.log('server has been started');

            const productsList = [
                { article: 244470768, marketplace: 'WB' },
                { article: 240045188, marketplace: 'WB' }
            ];

            parser.parseAll(productsList)
                .then(() => {
                    console.log('Парсинг завершён успешно');
                })
                .catch(err => {
                    console.error('Ошибка при парсинге товаров:', err);
                });
        });

    } catch (e) {
        console.error('Ошибка запуска сервера:', e);
    }
}

start()





