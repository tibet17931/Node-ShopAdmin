
const router = require('express').Router();
const { requireJWTAuth } = require('../middleware')
const { upload } = require('../middleware')
var multer = require('multer')
// var upload = multer({ dest: 'uploads/' })

//Controllers
const User = require('../controllers/user.controller');

//Routes
router.post('/login', User.login);
router.post('/registor', User.registor);
router.get('/getProfile', [requireJWTAuth, User.getProfile])

module.exports = router;