const express = require('express');
const TaskController = require('../controllers/TaskController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
const ctrl = new TaskController();

router.use(authMiddleware);

router.get('/', ctrl.getAll);
router.post('/', ctrl.create);
router.patch('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
