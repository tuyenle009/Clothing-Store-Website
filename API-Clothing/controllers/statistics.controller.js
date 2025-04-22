const Statistics = require("../models/statistics.model");

module.exports = {
  getAll: (req, res) => {
    Statistics.getAll((err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    Statistics.getById(id, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  getDashboardStats: (req, res) => {
    Statistics.getDashboardStats((err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  getMonthlyRevenue: (req, res) => {
    Statistics.getMonthlyRevenue((err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  insert: (req, res) => {
    const data = req.body;
    Statistics.insert(data, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  update: (req, res) => {
    const data = req.body;
    const id = req.params.id;
    Statistics.update(data, id, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    Statistics.delete(id, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },
};
