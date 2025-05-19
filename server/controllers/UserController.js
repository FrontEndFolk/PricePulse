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
        //const url = req.url;
        //const filters = req.filters;
        console.log(req.body);
        //let json = ParsingModule.parse(url);

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