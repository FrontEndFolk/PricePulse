const Router = require('express')
const router = new Router()
const userController = require('../controllers/UserController')

router.get('/test', userController.test)
router.get('/index', userController.index);
router.post('/parse', userController.parse);

module.exports = router