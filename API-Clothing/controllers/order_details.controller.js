const Order_details = require("../models/order_details.model");

module.exports = {
  getAll: (req, res) => {
    Order_details.getAll((err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    Order_details.getById(id, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  getByOrderId: (req, res) => {
    const orderId = req.params.orderId;
    Order_details.getByOrderId(orderId, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  insert: (req, res) => {
    const data = req.body;
    Order_details.insert(data, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  update: (req, res) => {
    const data = req.body;
    const id = req.params.id;
    Order_details.update(data, id, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    Order_details.delete(id, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },
};
