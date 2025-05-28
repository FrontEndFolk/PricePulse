const TelegramBot = require('node-telegram-bot-api');
const sqlite3 = require('sqlite3').verbose();
const db = require('./db.js');

const bot = new TelegramBot('8103651866:AAHZhprNudw2WwmLu7GrOUEkN6Hoy3MWz7Y', { polling: true });

const sendNotification = async ({ chat_id, text, image_url }) => {
    try {
        if (image_url) {
            await bot.sendPhoto(chat_id, image_url, { caption: text });
        } else {
            await bot.sendMessage(chat_id, text);
        }
    } catch (err) {
        console.error(`Ошибка при отправке уведомления в Telegram для chat_id=${chat_id}:`, err.message);
    }
};

bot.onText(/\/start (.+)/, async (msg, match) => {
    const token = match[1];
    const chatId = msg.chat.id;

    const sqlite3 = require('sqlite3').verbose();
    const path = require('path');
    const db = new sqlite3.Database(path.join(__dirname, '../modules/database.sqlite'));

    db.get('SELECT id FROM users WHERE telegram_token = ?', [token], (err, user) => {
        if (err || !user) {
            bot.sendMessage(chatId, "Неверный токен или вы уже привязаны.");
            return;
        }

        db.run('UPDATE users SET chat_id = ? WHERE id = ?', [chatId, user.id], (err) => {
            if (err) {
                bot.sendMessage(chatId, "Ошибка при привязке. Попробуйте позже.");
                return;
            }
            bot.sendMessage(chatId, "Telegram успешно привязан к вашему аккаунту!");
        });
    });
});

module.exports = { sendNotification };