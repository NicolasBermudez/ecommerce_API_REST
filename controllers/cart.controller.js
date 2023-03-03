const Cart = require('../models/cart.models');
const Order = require('../models/order.model');
const Product = require('../models/product.model');
const ProductInCart = require('../models/productInCart');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.addProductToCart = catchAsync(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const { cart } = req;

  const productInCart = await ProductInCart.create({
    cartId: cart.id,
    productId,
    quantity,
  });

  res.status(201).json({
    status: 'success',
    message: 'the product has been added',
    productInCart,
  });
});

exports.updateCart = catchAsync(async (req, res, next) => {
  const { newQty } = req.body;

  const { productInCart } = req;

  if (nexQty < 0) {
    return next(new AppError('the quantity must be greater than 0', 400));
  }

  if (newQty === 0) {
    await productInCart.update({ quantity: newQty, status: 'removed' });
  } else {
    await productInCart.update({ quantity: newQty, status: 'active' });
  }

  res.status(201).json({
    status: 'success',
    message: 'the product has been added',
    productInCart,
  });
});

exports.removeProductToCart = catchAsync(async (req, res, next) => {
  const { productInCart } = req;

  await productInCart.update({ quantity: 0, status: 'removed' });

  res.status(200).json({
    status: 'success',
    message: 'the product in cart has been removed',
  });
});

exports.buyProductOnCart = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const cart = await Cart.findOne({
    attributes: ['id, userId'],
    where: {
      userId: sessionUser.id,
      status: 'active',
    },
    include: [
      {
        model: ProductInCart,
        attributes: { exclude: ['status', 'createdAt', 'updatedAt'] },
        where: {
          status: 'active',
        },
        include: [
          {
            model: Product,
            attributes: { exclude: ['status', 'createdAt', 'updatedAt'] },
          },
        ],
      },
    ],
  });

  if (!cart) {
    return next(new AppError('there are not products in cart', 400));
  }
  let totalPrice = 0;

  cart.productInCarts.forEach(productInCart => {
    totalPrice += productInCart.quantity * ProductInCart.product.price;
  });

  const purchaseProductPromise = cart.productInCart.map(async productInCart => {
    const product = await Product.findOne({
      where: {
        id: productInCart.productId,
      },
    });

    const newStrock = product.quantity - productInCart.quantity;

    return await product.update({ quantity: newStrock });
  });

  const statusProductInCartPromises = cart.productInCarts.map(
    async productInCart => {
      const productInCartFoundIt = await productInCart.findOne({
        where: {
          id: productInCart.id,
          status: 'active',
        },
      });

      return await productInCartFoundIt.update({ status: 'purchased' });
    }
  );

  const resp = await Promise.all(productInCartFoundIt);

  await Promise.all(purchaseProductPromise);

  await cart.update({ status: 'purchased' });

  const order = await Order.create({
    userId: sessionUser.id,
    cartId: cart.id,
    totalPrice,
  });

  res.status(201).json({
    message: 'the order has been generated succesfully',
    order,
  });
});
