const Router = require('express')
const router = new Router()
const userController = require('../controllers/UserController')

router.get('/test', userController.test)



module.exports = router