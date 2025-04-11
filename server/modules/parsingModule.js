class ParsingModule {
    parse(url) {
        return JSON.stringify({ test: "test" })
    }

    parseAll() {
        // получить все ссылки из бд 
        // для каждой ссылки 
        // выполнить функицю parse
        // вернуть массив json строк

        // можно в целом возвращать сразу все соответсвующие объекты из бд что бы заново из в цикле не запрашивать
        // да можно хоть тут уведомления отправлять зависит от того на сколько сильно мы хотим говнокодить
    }

    cronTest() {
        console.log('function called via cron job');
    }
}

module.exports = new ParsingModule(); 