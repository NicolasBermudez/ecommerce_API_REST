const { Router } = require('express');
const { check } = require('express-validator');
const {
  findProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  findProduct,
} = require('../controllers/product.controller');
const { restrictTo } = require('../middlewares/auth.middleware');
const { validProductById } = require('../middlewares/products.middlewares');
const { validateFields } = require('../middlewares/validateField.middlewares');
const {
  createProductValidation,
} = require('../middlewares/validation.middleware');
const { upload } = require('../utils/multer');

const router = Router();

//IMPORTANTE ESTOS COMENTARIOS SON MERAMENTE EDUCATIVOS

// Esta ruta me va a encontrar todos los productos, esta ruta viene
// del archivo servidor que tiene un path product y este ruta se dirige hacia
// el controlador de productos que se llama findProduct
router.get('/', findProducts);

// Esta ruta me va a encontrar un un producto dado un id, este id se lo especifico
// por el path es decir por los parametros de la url, esta ruta viene
// del archivo servidor que tiene un path product y este ruta se dirige hacia
// el controlador de productos que se llama findProductById
router.get('/:id', validProductById, findProduct);

// Esta ruta me va a crear un un producto ,esta ruta viene
// del archivo servidor que tiene un path product y este ruta se dirige hacia
// el controlador de productos que se llama createProduct

router.post(
  '/',
  createProductValidation,
  upload.array('productImgs', 3),
  validateFields,
  restrictTo('admin'),
  createProduct
);

router.patch(
  '/:id',
  [
    check('title', 'The title is required').not().isEmpty(),
    check('description', 'The description is required').not().isEmpty(),
    check('quantity', 'The quantity is required').not().isEmpty(),
    check('quantity', 'The quantity must be a number').isNumeric(),
    check('price', 'The price is required').not().isEmpty(),
    check('price', 'The price must be a number').isNumeric(),
    validateFields,
    validProductById,
    restrictTo('admin'),
  ],
  updateProduct
);

router.delete('/:id', validProductById, restrictTo('admin'), deleteProduct);

module.exports = {
  productRouter: router,
};
