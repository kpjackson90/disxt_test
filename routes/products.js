const express = require('express');
const mongoose = require('mongoose');
const Product = mongoose.model('Product');
const { roleAuthorization } = require('../middleware/roleAuthorization');
const { requireAuth } = require('../middleware/requireAuth');

const router = express.Router();

/**Get all products */
router.get(
  '/api/products',
  requireAuth,
  roleAuthorization(['admin', 'client']),
  async (req, res) => {
    try {
      let products;
      if (req.user.role === 'admin') {
        products = await Product.find({}).populate('created_by');
      } else {
        products = await Product.find({}, 'name price description');
      }

      return res.status(200).send(products);
    } catch (err) {
      return res.status(400).send({ message: err.message });
    }
  }
);

/**Get individual product */
router.get(
  '/api/product/:id',
  requireAuth,
  roleAuthorization(['admin', 'client']),
  async (req, res) => {
    try {
      let product;
      if (req.user.role === 'admin') {
        product = await Product.findById({ _id: req.params.id }).populate(
          'created_by'
        );
      } else {
        product = await Product.findById(
          { _id: req.params.id },
          'name price description'
        );
      }

      return res.status(200).send(product);
    } catch (err) {
      return res.status(400).send({ message: err.message });
    }
  }
);

/**Create a product */
router.post(
  '/api/product',
  requireAuth,
  roleAuthorization(['admin']),
  async (req, res) => {
    const { name, price, description } = req.body;
    const product = new Product({
      name,
      price,
      description,
      created_by: req.user._id,
    });

    if (!name) {
      return res.status(400).send({ message: 'Name cannot be left empty' });
    }
    if (!price) {
      return res.status(400).send({ message: 'Price cannot be left empty' });
    }
    if (!description) {
      return res
        .status(400)
        .send({ message: 'Description cannot be left empty' });
    }

    try {
      await product.save();
      return res
        .status(200)
        .send({ product, message: 'Product created successfully' });
    } catch (err) {
      return res.status(400).send({ message: err.message });
    }
  }
);

/**Delete a product */
router.delete(
  '/api/product/:id',
  requireAuth,
  roleAuthorization(['admin']),
  async (req, res) => {
    const product = await Product.findById({ _id: req.params.id });

    if (!product) {
      return res.status(400).send({ message: 'Product does not exist' });
    }
    try {
      await product.remove();
      return res.status(200).send({ message: 'Product deleted successfully' });
    } catch (err) {
      return res.status(400).send({ message: err.message });
    }
  }
);

/**Update a product */
router.put(
  '/api/product/:id',
  requireAuth,
  roleAuthorization(['admin']),
  async (req, res) => {
    const product = await Product.findById({ _id: req.params.id });

    if (!product) {
      return res.status(400).send({ message: 'Product does not exist' });
    }

    try {
      await Product.updateOne({ _id: req.params.id }, req.body);
      return res.status(200).send({ message: 'Product updated successfully' });
    } catch (err) {
      return res.status(400).send({ message: err.message });
    }
  }
);

module.exports = router;
