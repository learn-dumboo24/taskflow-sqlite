const express = require('express');
const FollowUpController = require('../controllers/FollowUpController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
const ctrl = new FollowUpController();

router.use(authMiddleware);

router.get('/', ctrl.getAll);
router.patch('/:id/resolve', ctrl.resolve);

module.exports = router;
