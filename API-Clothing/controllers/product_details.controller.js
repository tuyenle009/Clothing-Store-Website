const Product_details = require("../models/product_details.model");

module.exports = {
  getAll: (req, res) => {
    Product_details.getAll((err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    Product_details.getById(id, (err, result) => {
      if (err) return res.status(500).send(err);
      if (!result) return res.status(404).send('Product detail not found');
      res.send(result);
    });
  },

  getByProductId: (req, res) => {
    const productId = req.params.productId;
    Product_details.getByProductId(productId, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  insert: (req, res) => {
    const data = req.body;
    // Validate required fields
    if (!data.product_id || !data.color || !data.size || !data.stock_quantity) {
      return res.status(400).send('Missing required fields');
    }
    Product_details.insert(data, (err, result) => {
      if (err) return res.status(500).send(err);
      res.status(201).send(result);
    });
  },

  update: (req, res) => {
    const data = req.body;
    const id = req.params.id;
    // Validate required fields
    if (!data.product_id || !data.color || !data.size || !data.stock_quantity) {
      return res.status(400).send('Missing required fields');
    }
    Product_details.update(data, id, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    Product_details.delete(id, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },
};
