const express = require('express');
const router = express.Router();
const controller = require('../controllers/concession_category.controller');
const { authenticate, isAdmin } = require('../middlewares/auth.middleware');

router.get('/', controller.getAll);
router.post('/', authenticate, isAdmin, controller.create);
router.put('/:id', authenticate, isAdmin, controller.update);
router.delete('/:id', authenticate, isAdmin, controller.delete);

module.exports = router;
