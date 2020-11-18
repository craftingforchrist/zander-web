const { Router } = require('express');
const router = Router();
const authenticationController = require('../controllers/authenticationController');

// Login GET
router.get('/login', authenticationController.login_get);

// Login POST
router.post('/login', authenticationController.login_post);

// Register GET
router.get('/register', authenticationController.register_get);

// Register POST
router.post('/register', authenticationController.register_post);

module.exports = router;
