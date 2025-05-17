const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, 'database.sqlite');

if (!fs.existsSync(dbPath)) {
    throw new Error(`Файл базы данных не найден: ${dbPath}`);
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Ошибка подключения к БД:', err.message);
    } else {
        console.log('Успешное подключение к SQLite');
    }
});

module.exports = db;