const User = require('./user.model');
const Cart = require('./cart.models');
const Product = require('./product.model');
const Order = require('./order.model');
const ProductImg = require('./productImg.model');

const initModel = () => {
  User.hasMany(Product, { sourceKey: 'id', foreignKey: 'userId' });
  Product.belongsTo(User, { sourceKey: 'id', foreignKey: 'userId' });

  User.hasMany(Cart, { sourceKey: 'id', foreignKey: 'userId' });
  Cart.belongsTo(User, { sourceKey: 'id', foreignKey: 'userId' });

  User.hasMany(Order, { sourceKey: 'id', foreignKey: 'userId ' });
  Order.belongsTo(User, { sourceKey: 'id', foreignKey: 'userId' });

  Product.hasMany(ProductImg, { sourceKey: 'id', foreignKey: 'productId' });
  ProductImg.belongsTo(Product, { sourceKey: 'id', foreignKey: 'productId' });

  Order.hasOne(Cart, { sourceKey: 'id', foreignKey: 'cartId' });
  Cart.belongsTo(Order, { sourceKey: 'id', foreignKey: 'cartId' });
};

module.exports = initModel;
