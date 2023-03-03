const Cart = require('../models/cart.models');
const Order = require('../models/order.model');
const ProductInCart = require('../models/productInCart');
const User = require('../models/user.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { ref, getDownloadURL } = require('firebase/storage');
const { storage } = require('../utils/firebase');

exports.findUsers = catchAsync(async (req, res, next) => {
  const usersPromises = users.map(async user => {
    const imgRef = ref(storage, user.profileImageUrl);

    const url = await getDownloadURL(imgRef);

    user.profileImageUrl = url;

    return user;
  });

  const usersResolve = await Promise.all(usersPromises);
  // 1. BUSCAR TODOS LOS USUARIOS QUE ESTAN CON STATUS TRUE
  const users = await User.findAll({
    where: {
      status: true,
    },
  });

  // NOTA: NO ES NECESARIO ENVIAR MENSAJE DE ERROR SI NO HAY USUARIOS, DEBIDO A QUE EL DEVUELVE UN ARRAY VACIO
  // LES PONGO UN EJEMPLO, SUPONGAMOS QUE USTEDES BUSCAN ALGUN PRODUCTO EN UNA TIENDA, Y ESE PRODUCTO NO SE ENCUENTRA,
  // LA TIENDA NO LE ENVIA A USTED NINGUN MENSAJE DE ERROR, SIMPLEMENTE NO LE MUESTRA NADA, ES POR ESO QUE EN ESTE CASO
  // PARA BUSCAR TODOS LOS USUARIOS NO ES NECESARIO DEVOLVER UN ERROR SI NO LOS ENCUENTRA, SIMPLEMENTE RETORNARA UN ARREGLO VACIO

  // 2. ENVIAR UNA RESPUESTA AL USUARIO
  res.status(200).json({
    status: 'success',
    message: 'Users was found successfully',
    users: usersResolve,
  });
});

exports.findUser = catchAsync(async (req, res, next) => {
  // 1. OBTENER EL ID DE LOS PARAMETROS
  const { user } = req;

  const imgRef = ref(storage, user.profileImageUrl);

  const url = await getDownloadURL(imgRef);

  user.profileImageUrl = url;

  res.status(200).json({
    status: 'success',
    message: 'User was found successfully',
    user,
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { username, email } = req.body;
  const { user } = req;

  await user.update({ username, email });

  res.status(200).json({
    status: 'success',
    message: 'User updated successfully',
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: false });

  res.status(200).json({
    status: 'success',
    message: 'User deleted successfully',
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { currentPassword, newPassword } = req.body;

  if (!(await bcrypt.compare(currentPassword, user.password))) {
    return next(new AppError('Incorrect password', 401));
  }

  const salt = await bcrypt.genSalt(10);
  const encriptedPassword = await bcrypt.hash(newPassword, salt);

  await user.update({
    password: encriptedPassword,
    passwordChangeAt: new Date(),
  });
  res.status(200).json({
    status: 'success',
    message: 'The user password was updated successfylly',
  });
});

exports.getOrders = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const orders = await Order.findAll({
    where: {
      userId: sessionUser.userId,
      status: 'true',
    },
    include: [
      {
        model: Cart,
        where: {
          status: 'purchased',
        },
        include: [
          {
            model: ProductInCart,
            where: { status: 'purchased' },
          },
        ],
      },
    ],
  });
});

exports.getOrderById = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const { id } = req.params;

  const order = await Order.findOne({
    where: {
      id,
      userId: sessionUser.userId,
      status: 'true',
    },
    include: [
      {
        model: Cart,
        where: {
          status: 'purchased',
        },
        include: [
          {
            model: ProductInCart,
            where: { status: 'purchased' },
          },
        ],
      },
    ],
  });
});
