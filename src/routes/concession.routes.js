const express = require('express');
const router = express.Router();
const concessionController = require('../controllers/concession.controller');
const { authenticate, isAdmin } = require('../middlewares/auth.middleware');

router.get('/', concessionController.getAll);
router.get('/:id', concessionController.getById);
router.post('/', authenticate, isAdmin, concessionController.create);
router.put('/:id', authenticate, isAdmin, concessionController.update);
router.delete('/:id', authenticate, isAdmin, concessionController.delete);

module.exports = router;
