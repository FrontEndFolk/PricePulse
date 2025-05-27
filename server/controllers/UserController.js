const User = require('../models/User.js')
const db = require('../modules/db.js');
const util = require("util");
const crypto = require("crypto");
//создать инстанс модуля парсинга - parsingModule
const ParsingModule = require('../modules/parsingModule.js');
const { fetchAll, getUserByEmail, getUserById, createUser } = require('../modules/sql.js');
const bcrypt = require("bcrypt");
const getAsync = util.promisify(db.get.bind(db));
const runAsync = util.promisify(db.run.bind(db));

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
        const existingUser = await getUserByEmail(db, email);

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const userId = await createUser(db, [email, passwordHash, null]);
        req.session.user = { id: userId };
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
        req.session.user = { id: user.id };
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
        const userId = req.session?.user?.id;
        if (!userId) return res.json({ user: null });

        const user = await getUserById(db, userId);
        return res.json(user);
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

    async telegramLink(req, res) {
        const userId = req.session?.user?.id;
        if (!userId) return res.status(401).json({ error: 'Not logged in' });

        // Генерация токена, если его нет
        const existing = await getAsync("SELECT telegram_token FROM users WHERE id = ?", [userId]);
        let token = existing?.telegram_token;

        if (!token) {
            token = crypto.randomBytes(16).toString("hex");
            await runAsync("UPDATE users SET telegram_token = ? WHERE id = ?", [token, userId]);
        }

        const link = `https://t.me/PricePulseNotifierBot?start=${token}`;
        res.json({ link });
    }
}

module.exports = new UserController();