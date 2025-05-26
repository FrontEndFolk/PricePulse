const User = require('../models/User.js')
const db = require('../modules/db.js');
//создать инстанс модуля парсинга - parsingModule
const ParsingModule = require('../modules/parsingModule.js');
const { fetchAll, getUserByEmail, createUser } = require('../modules/sql.js');
const bcrypt = require("bcrypt");

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

    async signup(req, res) {
        const { email, password } = req.body;

        const user = await getUserByEmail(db, email);

        console.log("getByEmail user: " + user);

        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        createUser(db, [email, passwordHash, null]);
        req.session.user = { email };

        res.json({ message: "Signup successful" });
    }

    async login(req, res) {

        const { email, password } = req.body;

        const user = await getUserByEmail(db, email);

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }
        req.session.user = { email };
        res.json({ message: "Login successful" });
    }

    async logout(req, res) {
        req.session.destroy((err) => {
            if (err) return res.status(500).json({ message: "Logout failed" });
            res.clearCookie("connect.sid");
            res.json({ message: "Logged out successfully" });
        });
    }

    async current(req, res) {
        if (req.session.user === undefined) {
            return res.json({ user: null });
        }
        return res.json(await getUserByEmail(db, req.session.user.email));
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