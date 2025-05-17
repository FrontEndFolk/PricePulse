const express = require('express')
const cors = require('cors');
const port = 3000

const parser = require('./modules/parsingModule');
const router = require('./routes/index');
const notificator = require('./modules/notificationModule');
const cronJobs = require("./CronJobs");

const USER_CHAT_ID = 957059612;
const productsList = [
    { article: 244470768, marketplace: 'WB' },
    { article: 240045188, marketplace: 'WB' }
];

const app = express()
app.use(cors());
app.use("/", router);
app.get('/', async (req, res) => {
    res.send('Hello World!')
})

async function start() {
    try {
        app.listen(port, async () => {
            console.log('Сервер запущен');
            parser.parseAll(productsList)
            .then(async (parsedResults) => {
                await parser.saveToDatabase(parsedResults);
                console.log('Парсинг и сохранение завершены');
                
                for (const product of parsedResults) {
                    await notificator.sendNotification({
                        chat_id: USER_CHAT_ID,
                        text: `Товар обновлён: ${product.name}\nЦена: ${product.sale_price}₽`,
                        image_url: product.image_url || null
                    });
                }
            })
            .catch(err => {
                console.error('Ошибка при парсинге:', err);
            });
        });
    } catch (e) {
        console.error('Ошибка запуска сервера:', e);
    }
}

start();





