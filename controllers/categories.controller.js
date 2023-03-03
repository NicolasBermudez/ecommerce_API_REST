const Category = require('../models/category.models');
const Product = require('../models/product.model');
const catchAsync = require('../utils/catchAsync');

exports.createCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;

  const category = await Category.create({ name });

  res.status(201).json({
    status: 'success',
    message: 'Category created successfully',
    category,
  });
});

exports.findCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.findAll({
    where: {
      status: true,
    },
    include: [{ model: Product }],
    require: false,
  });

  res.status(200).json({
    status: 'success',
    message: 'Categories fetched successfully',
    categories,
  });
});

exports.findCategory = catchAsync(async (req, res, next) => {
  const { category } = req;

  res.status(200).json({
    status: 'success',
    message: 'Category fetched successfully',
    category,
  });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  const { category } = req;

  await category.update({ name });

  res.status(200).json({
    status: 'success',
    message: 'Category updated successfully',
  });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const { category } = req;

  await category.update({ status: false });

  res.status(200).json({
    status: 'success',
    message: 'Category deleted successfully',
  });
});
