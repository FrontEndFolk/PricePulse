const express = require('express')
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const app = express()
const port = 3000
const uri = "mongodb+srv://admin:admin@pricenotifyer.qomwx.mongodb.net/sample_mflix?retryWrites=true&w=majority&appName=PriceNotifyer";

const { Schema, model } = mongoose;

const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
})

const User = model('User', userSchema);


app.use(cors());

app.get('/', async (req, res) => {
    res.send('Hello World!')
    const user = await User.find({}).then((data) => console.log(data));
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





