const Router = require('express')
const router = new Router()
const userController = require('../controllers/UserController')

router.get('/test', userController.test)
router.get('/index', userController.index);
router.post('/parse', userController.parse);
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/current', userController.current);
module.exports = router