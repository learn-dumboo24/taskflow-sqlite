const express = require('express');
const AuthController = require('../controllers/AuthController');

const router = express.Router();
const ctrl = new AuthController();

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);

module.exports = router;
