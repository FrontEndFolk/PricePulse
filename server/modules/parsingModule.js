const path = require('path');
const util = require('util');
const db = require('./db.js');
const iconv = require('iconv-lite');
const { spawn } = require('child_process');

// Наобещал за щёку
const runAsync = util.promisify(db.run.bind(db));
const getAsync = util.promisify(db.get.bind(db));
const allAsync = util.promisify(db.all.bind(db));

class ParsingModule {
    callPython(scriptName, input) {
        return new Promise((resolve, reject) => {
            const scriptPath = path.join(__dirname, '..', 'python_scripts', scriptName);
            const pythonPath = path.join(__dirname, '..', '.venv', 'Scripts', 'python.exe');

            const py = spawn(pythonPath, [scriptPath, input], {
                env: {
                    ...process.env,
                    PYTHONIOENCODING: 'utf-8'
                }
            });

            let stdoutData = '';
            let stderrData = '';

            py.stdout.on('data', (data) => {
                stdoutData += iconv.decode(data, 'utf-8');
            });

            py.stderr.on('data', (data) => {
                stderrData += iconv.decode(data, 'utf-8');
            });

            py.on('close', (code) => {
                if (code !== 0) {
                    console.error('Python stderr:', stderrData);
                    return reject(new Error(`Python exited with code ${code}`));
                }

                try {
                    const json = JSON.parse(stdoutData);
                    resolve(json);
                } catch (e) {
                    console.error('Ошибка JSON:', e);
                    reject(e);
                }
            });
        });
    }

    async parse(url, marketplace) {
        const script = marketplace === 'WB' ? 'parse_wb.py' : 'parse_ozon.py';
        try {
            return await this.callPython(script, url);
        } catch (err) {
            //console.error('Ошибка при вызове Python:', err);
            return null;
        }
    }

    async parseAll(productList) {
        for (const { article, marketplace } of productList) {
            const data = await module.exports.parse(article, marketplace);
            if (!data) {
                console.warn(`Пропущен товар ${marketplace}:${article} — не удалось получить данные`);
                continue;
            }

            const existing = await getAsync(
                'SELECT id, price, sale_price FROM products WHERE article = ? AND marketplace = ?',
                [article, marketplace]
            );

            if (existing) {
                // Обновляем продукт
                await runAsync(`
                    UPDATE products
                    SET 
                        name = ?,
                        price_old = price,
                        sale_price_old = sale_price,
                        price = ?,
                        sale_price = ?,
                        total_stock = ?
                    WHERE id = ?
                `, [
                    data.name,
                    data.price,
                    data.sale_price,
                    data.total_quantity,
                    existing.id
                ]);

                const productId = existing.id;

                // Удаляем старые размеры
                await runAsync('DELETE FROM sizes WHERE product_id = ?', [productId]);

                // Вставляем новые размеры
                for (const size of data.sizes) {
                    await runAsync(
                        'INSERT INTO sizes (product_id, size, stock) VALUES (?, ?, ?)',
                        [productId, size.size, size.stock]
                    );
                }

            } else {
                // Вставляем новый продукт
                const insertProductStmt = await new Promise((resolve, reject) => {
                    db.run(`
                        INSERT INTO products (
                            article, marketplace, name, price, sale_price, price_old, sale_price_old, total_stock
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    `, [
                        article,
                        marketplace,
                        data.name,
                        data.price,
                        data.sale_price,
                        null,
                        null,
                        data.total_quantity
                    ], function (err) {
                        if (err) return reject(err);
                        resolve(this);
                    });
                });

                const productId = insertProductStmt.lastID;

                // Вставляем размеры
                for (const size of data.sizes) {
                    await runAsync(
                        'INSERT INTO sizes (product_id, size, stock) VALUES (?, ?, ?)',
                        [productId, size.size, size.stock]
                    );
                }
            }
            console.log(`Обработан товар: ${marketplace}:${article}`);
        }
    }

    cronTest() {
        console.log('function called via cron job');
    }
}

module.exports = new ParsingModule();

/* 
db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log(rows);
    }
}); 
*/