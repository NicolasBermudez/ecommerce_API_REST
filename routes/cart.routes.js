const { Router } = require('express');
const { check } = require('express-validator');
const {
  addProductToCart,
  updateCart,
  removeProductToCart,
  buyProductOnCart,
} = require('../controllers/cart.controller');
const { protect } = require('../middlewares/auth.middleware');
const {
  validExistCart,
  validExistProductInCart,
  validExistProductInCartForUpdate,
  validExistProductInCartByParamsForUpdate,
} = require('../middlewares/cart.middleware');
const {
  validBodyProductById,
  validIfExistProductsInStock,
  validExistProductInStockForUpdate,
  validExistProductIdByParams,
} = require('../middlewares/products.middlewares');
const { validateFields } = require('../middlewares/validateField.middlewares');

const router = Router();

router.use(protect);

router.post(
  '/add-product',
  [
    check('productId', 'the productId is required').not().isEmpty(),
    check('productId', 'the productId is required').isNumeric(),
    check('quantity', 'the quantity is required').not().isEmpty(),
    check('quantity', 'the quantity is required').isNumeric(),
    validateFields,
    validBodyProductById,
    validIfExistProductsInStock,
    validExistCart,
    validExistProductInCart,
  ],
  addProductToCart
);

router.patch(
  '/update-cart',
  [
    check('productId', 'the productId is required').not().isEmpty(),
    check('productId', 'the productId is required').isNumeric(),
    check('newQty', 'the newQty is required').not().isEmpty(),
    check('newQty', 'the newQty is required').isNumeric(),
    validateFields,
    validBodyProductById,
    validExistProductInStockForUpdate,
    validExistProductInCartForUpdate,
  ],
  updateCart
);

router.delete(
  '/:productId',
  validExistProductIdByParams,
  validExistProductInCartByParamsForUpdate,
  removeProductToCart
);

module.exports = { cartRouter: router };

router.post('/purchase', buyProductOnCart);
