const User = require('../models/User.js')
const db = require('../modules/db.js');
const util = require("util");
const crypto = require("crypto");
const parser = require('../modules/parsingModule.js');
const { fetchAll, getUserByEmail, getUserById, createUser } = require('../modules/sql.js');
const bcrypt = require("bcrypt");
const getAsync = util.promisify(db.get.bind(db));
const runAsync = util.promisify(db.run.bind(db));
const fetchOne = (db, query, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
};

class UserController {
    async test(req, res, next) {
        const user = await User.find({}).limit(2).then((data) => JSON.stringify(data));
        res.send(user);
    }

    async index(req, res, next) {

        const userId = req.session?.user?.id;
        console.log(userId);
        db.all("SELECT * FROM products WHERE userId = ?  ORDER BY products.id DESC", [userId], (err, rows) => {
            if (err) {
                throw err;
            }
            res.send(rows)
        });
    }

    async parse(req, res, next) {
        const userId = req.session?.user?.id;
        let {
            link,
            filter_price,
            amount = null,
            size = null
        } = req.body;

        console.log(req.body)

        let json = await parser.parse(link, "WB");

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
                `INSERT INTO products(userId,filter_price,amount,p_size,article,marketplace,name,price,sale_price,price_old,sale_price_old,total_stock,image_url) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                [userId, filter_price, amount, size, article, "WB", name, price, sale_price, price, sale_price, total_quantity, ""],
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
        return res.json({ user: user });
    }

    async cronTest() {
        const originalProducts = await fetchAll(db, "SELECT * FROM products");

        const parsedResults = await parser.parseAll(originalProducts);
        await parser.saveToDatabase(parsedResults);

        const updatedProducts = await fetchAll(db, "SELECT * FROM products");

        for (const product of updatedProducts) {
            const user = await fetchOne(db, 'SELECT chat_id FROM users WHERE id = ?', [product.user_id]);
            if (!user || !user.chat_id) continue;

            let notify = false;
            let reason = "";

            if (product.filter_price && product.sale_price <= product.filter_price) {
                notify = true;
                reason += `Цена упала до ${product.sale_price}₽ (фильтр: ≤ ${product.filter_price})\n`;
            }

            if (product.filter_stock && product.total_stock >= product.filter_stock) {
                notify = true;
                reason += `В наличии: ${product.total_stock} шт (фильтр: ≥ ${product.filter_stock})\n`;
            }

            if (product.filter_size) {
                const matchingSize = await fetchOne(db, `
                    SELECT stock FROM sizes WHERE product_id = ? AND size = ?
                `, [product.id, product.filter_size]);

                if (matchingSize && matchingSize.stock >= 1) {
                    notify = true;
                    reason += `👕 Размер ${product.filter_size} в наличии: ${matchingSize.stock} шт\n`;
                }
            }

            if (notify) {
                await notificator.sendNotification({
                    chat_id: user.chat_id,
                    text: `Обновление по товару: ${product.name}\n${reason}\nhttps://www.wildberries.ru/catalog/${product.article}/detail.aspx`,
                    image_url: product.image_url || null
                });
            }
        }
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