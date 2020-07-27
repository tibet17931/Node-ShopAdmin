
const router = require('express').Router();

//Controllers
const User = require('../controllers/user.controller');

//Routes
router.post('/login', User.login);

module.exports = router;