const express = require('express')
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const port = 5000

const router = require('./routes/index');
const parser = require('./modules/parsingModule');
//const bot = require('./modules/telegramBot');
const cronJobs = require("./CronJobs");

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
            console.log('Сервер запущен на 5000');
            //cronJobs.startParsingJob();
        });
    } catch (e) {
        console.error('Ошибка запуска сервера:', e);
    }
}

start();





