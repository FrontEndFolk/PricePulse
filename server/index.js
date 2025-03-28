const express = require('express')
const cors = require('cors');
const port = 3000

const { default: mongoose } = require('mongoose');
const uri = "mongodb+srv://admin:admin@pricenotifyer.qomwx.mongodb.net/sample_mflix?retryWrites=true&w=majority&appName=PriceNotifyer";

const router = require("./routes/index");


const app = express()
app.use(cors());
app.use("/", router);

app.get('/', async (req, res) => {
    res.send('Hello World!')
})

async function start() {
    try {
        await mongoose.connect(uri, {})
        app.listen(port, () => { // listen - запускает сервер
            console.log('server has been started')
        })

    } catch (e) {
        console.log(e);
    }
}

start()





