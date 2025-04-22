const Cart = require("../models/cart.model");

module.exports = {
  getAll: (req, res) => {
    // Nếu có user_id trong query, gọi getByUserId
    if (req.query.user_id) {
      Cart.getByUserId(req.query.user_id, (err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result);
      });
      return;
    }
    // Nếu không có user_id, lấy tất cả cart
    Cart.getAll((err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    Cart.getById(id, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  insert: (req, res) => {
    const data = req.body;
    Cart.insert(data, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  update: (req, res) => {
    const data = req.body;
    const id = req.params.id;
    Cart.update(data, id, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    Cart.delete(id, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  getCartCount: (req, res) => {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    Cart.getByUserId(user_id, (err, result) => {
      if (err) {
        console.error('Error getting cart count:', err);
        return res.status(500).json({ message: 'Error getting cart count', error: err.message });
      }
      // Đếm số lượng items khác nhau trong giỏ hàng
      const count = result.length;
      res.json(count);
    });
  },
};
