const User = require('../models/User.js')
const db = require('../modules/db.js');
//создать инстанс модуля парсинга - parsingModule
const ParsingModule = require('../modules/parsingModule.js');
const fetchAll = require('../modules/sql.js');

class UserController {
    async test(req, res, next) {
        const user = await User.find({}).limit(2).then((data) => JSON.stringify(data));
        res.send(user);
    }

    async index(req, res, next) {
        db.all("SELECT * FROM products ORDER BY products.id DESC ", [], (err, rows) => {
            if (err) {
                throw err;
            }
            res.send(rows)
        });
    }

    async parse(req, res, next) {
        let {
            link,
            filter_price,
            amount = null,
            size = null
        } = req.body;

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
            db.run(
                `INSERT INTO products(article,marketplace,name,price,sale_price,price_old,sale_price_old,total_stock,image_url) VALUES(?,?,?,?,?,?,?,?,?)`,
                [article, "WB", name, price, sale_price, price, sale_price, total_quantity, ""],
                (err) => { console.log(err) }
            );
        }

        res.send("ok");

    }

    async cronTest() {

        const dbData = await fetchAll(db, "SELECT * FROM products");

        let jsonArray = await ParsingModule.parseAll(dbData);

        dbData.forEach((row, index) => {
            if (row.price != jsonArray[index].price) //TODO пример условия. в таблицу надо добавить колонки фильтром и с ними все сравинать и потом отсюда отправлять уведомление
            {
                //обновить данные в бд хотя их вроде parseAll обновляет у тебя хз
                //отправить уведомление
            }
        });

        console.log(jsonArray);
    }
}

module.exports = new UserController();