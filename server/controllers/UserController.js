const User = require('../models/User.js')

class UserController {
    async test(req, res, next) {
        const user = await User.find({}).limit(2).then((data) => JSON.stringify(data));
        res.send(user);
    }
}

module.exports = new UserController();