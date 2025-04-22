const Orders = require("../models/orders.model");

module.exports = {
  getAll: (req, res) => {
    Orders.getAll((err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    Orders.getById(id, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  getByUserId: (req, res) => {
    const userId = req.params.userId;
    Orders.getByUserId(userId, (err, result) => {
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

    Orders.insert(data, (err, result) => {
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

    Orders.update(data, id, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    Orders.delete(id, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },
};
