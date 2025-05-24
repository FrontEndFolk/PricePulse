const User = require('../models/User.js')
const db = require('../modules/db.js');
//создать инстанс модуля парсинга - parsingModule
const ParsingModule = require('../modules/parsingModule.js');

class UserController {
    async test(req, res, next) {
        const user = await User.find({}).limit(2).then((data) => JSON.stringify(data));
        res.send(user);
    }

    async index(req, res, next) {
        db.all("SELECT * FROM products", [], (err, rows) => {
            if (err) {
                throw err;
            }
            res.send(rows)
        });
    }

    async parse(req, res, next) {
        let { link, filter_price, amount, size } = req.body;

        let json = await ParsingModule.parse(link, "WB");

        console.log(json);

        let {
            name = null,
            article = null,
            price = 0,
            sale_price = 0,
            color = 'unknown',
            sizes = [],
            total_quantity = 0
        } = json || {};

        if (name != null) {
            db.run(`INSERT INTO products(article,marketplace,name,price,sale_price,price_old,sale_price_old,total_stock,image_url) VALUES(?,?,?,?,?,?,?,?,?)`, [article, "WB", name, price, sale_price, price, sale_price, total_quantity, ""], (err) => { console.log(err) });
        }

        res.send("ok");

    }

    //TODO перенести кудаф-то  в другое место 
    cronTest() {
        let jsonArray = ParsingModule.parseAll();
        // для каждой строки js получить соответсвующую строчку бд (навенрео не очень хорошо так спасить запросы к бд но насрать в целом это фоновый таск)
        // если данные не совпадают 
        // отправить уведомление 
        // обновить данные 
    }
}

module.exports = new UserController();