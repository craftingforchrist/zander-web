const { Router } = require('express');
const router = Router();
const authenticationController = require('../controllers/authenticationController');

// Login GET
router.get('/login', authenticationController.login_get);

// Login POST
router.post('/login', authenticationController.login_post);

// Sign Up GET
router.get('/signup', authenticationController.signup_get);

// Sign Up POST
router.post('/signup', authenticationController.signup_post);

module.exports = router;
