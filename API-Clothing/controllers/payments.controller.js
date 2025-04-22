const Payments = require("../models/payments.model");

module.exports = {
  getAll: (req, res) => {
    Payments.getAll((err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    Payments.getById(id, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  getByOrderId: (req, res) => {
    const orderId = req.params.order_id;
    if (!orderId) {
      return res.status(400).send({ message: "Order ID is required" });
    }

    Payments.getByOrderId(orderId, (err, result) => {
      if (err) {
        console.error("Error fetching payment by order ID:", err);
        return res.status(500).send(err);
      }
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

    Payments.insert(data, (err, result) => {
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

    Payments.update(data, id, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    Payments.delete(id, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },
};
