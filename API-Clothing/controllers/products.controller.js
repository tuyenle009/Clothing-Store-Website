const Products = require("../models/products.model");

module.exports = {
  getAll: (req, res) => {
    const categoryId = req.query.category_id;
    if (categoryId) {
      Products.getByCategory(categoryId, (err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result);
      });
      return;
    }
    Products.getAll((err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    Products.getById(id, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  insert: (req, res) => {
    const data = req.body;

    if (data.created_at) {
      // Chuyển đổi thời gian về múi giờ Việt Nam (UTC+7)
      const date = new Date(data.created_at);
      date.setHours(date.getHours() + 7);
      data.created_at = date.toISOString().slice(0, 19).replace("T", " ");
    }

    Products.insert(data, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  update: (req, res) => {
    const data = req.body;
    const id = req.params.id;

    if (data.created_at) {
      // Chuyển đổi thời gian về múi giờ Việt Nam (UTC+7)
      const date = new Date(data.created_at);
      date.setHours(date.getHours() + 7);
      data.created_at = date.toISOString().slice(0, 19).replace("T", " ");
    }

    Products.update(data, id, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    Products.delete(id, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },
};



