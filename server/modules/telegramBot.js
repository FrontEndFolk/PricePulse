const TelegramBot = require('node-telegram-bot-api');
const sqlite3 = require('sqlite3').verbose();
const db = require('./db.js');

const bot = new TelegramBot('8103651866:AAHZhprNudw2WwmLu7GrOUEkN6Hoy3MWz7Y', { polling: true });

bot.onText(/\/start (.+)/, async (msg, match) => {
    const token = match[1];
    const chatId = msg.chat.id;

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