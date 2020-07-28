
const router = require('express').Router();

//Controllers
const User = require('../controllers/user.controller');

//Routes
router.post('/login', User.login);
router.post('/registor', User.registor);
router.get('/getProfile', User.getProfile)

module.exports = router;