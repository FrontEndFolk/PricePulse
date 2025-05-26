const express = require('express')
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const port = 5000

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

// parse request body
app.use(express.urlencoded());
app.use(express.json());

// allow requests
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// auth
app.use(cookieParser());
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
}));

// rotuer
app.use("/", router);

async function start() {
    try {
        app.listen(port, async () => {
            console.log('Сервер запущенa на 5000');
            //cronJobs.startParsingJob();
            // parser.parseAll(productsList)
            //     .then(async (parsedResults) => {
            //         await parser.saveToDatabase(parsedResults);
            //         console.log('Парсинг и сохранение завершены');

            //         // for (const product of parsedResults) {
            //         //     await notificator.sendNotification({
            //         //         chat_id: USER_CHAT_ID,
            //         //         text: `Товар обновлён: ${product.name}\nЦена: ${product.sale_price}₽`,
            //         //         image_url: product.image_url || null
            //         //     });
            //         // }
            //     })
            //     .catch(err => {
            //         console.error('Ошибка при парсинге:', err);
            //     });
        });
    } catch (e) {
        console.error('Ошибка запуска сервера:', e);
    }
}

start();





