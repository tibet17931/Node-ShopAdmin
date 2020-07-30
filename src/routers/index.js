
const router = require('express').Router();
const { requireJWTAuth } = require('../middleware')

//Controllers
const User = require('../controllers/user.controller');

//Routes
router.post('/login', User.login);
router.post('/registor', User.registor);
router.get('/getProfile', [requireJWTAuth, User.getProfile])

module.exports = router;