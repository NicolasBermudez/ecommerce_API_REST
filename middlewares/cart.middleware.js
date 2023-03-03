const Cart = require('../models/cart.models');
const ProductInCart = require('../models/productInCart');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.validExistCart = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  let cart = await Cart.findOne({
    where: {
      userId: sessionUser.id,
      status: 'active',
    },
  });

  if (!cart) {
    let newCart = await Cart.create({ userId: sessionUser.id });
  }

  req.cart = newCart;
  next();
});

exports.validExistProductInCart = catchAsync(async (req, res, next) => {
  const { product, cart } = req;

  const productIncart = await ProductInCart.findOne({
    where: {
      cartId: cart.id,
      productId: product.id,
    },
  });

  if (productInCart && productInCart.status === 'removed') {
    await productIncart.update({ status: 'active', quantity: 1 });
    return res.status(200).json({
      status: 'success',
      message: 'product successfully added',
    });
  }

  if (productIncart) {
    return next(new AppError('this product already esxist in de cart', 400));
  }

  req.productInCart = productIncart;
  next();
});

exports.validExistProductInCartForUpdate = catchAsync(
  async (req, res, next) => {
    const { sessionUser } = req;
    const { productId } = req.body;

    const cart = await Cart.findOne({
      where: {
        userId: sessionUser.id,
        status: 'active',
      },
    });

    const productInCart = await ProductInCart.findOne({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (!productInCart) {
      return next(new AppError('the product does not exist in the cart', 400));
    }
  }
);

exports.validExistProductInCartByParamsForUpdate = catchAsync(
  async (req, res, next) => {
    const { sessionUser } = req;

    const { productId } = req.params;

    const cart = await Cart.findOne({
      where: {
        userId: sessionUser.id,
        status: 'active',
      },
    });

    const productInCart = await ProductInCart.findOne({
      where: {
        cartId: cart.id,
        productId,
        status: 'active',
      },
    });

    if (!productInCart) {
      return next(new AppError('the product does not exist in the cart', 400));
    }

    req.productInCart = productInCart;

    next();
  }
);
