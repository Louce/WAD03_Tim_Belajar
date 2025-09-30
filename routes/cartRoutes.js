const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController'); 

// --- Routes Shopping Cart (/carts) ---

router.post('/:username/add', cartController.addProductToCart);
router.post('/:username/remove', cartController.removeProductFromCart);
router.get('/:username', cartController.getCart);

module.exports = router;
