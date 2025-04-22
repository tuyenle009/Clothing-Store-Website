const db = require("../common/db");

const Orders = (orders) => {
  this.order_id = orders.order_id;
  this.user_id = orders.user_id;
  this.total_price = orders.total_price;
  this.order_status = orders.order_status;
  this.created_at = orders.created_at;
  this.is_deleted = categories.is_deleted;

};

Orders.getById = (order_id, callback) => {
  const sqlString = "SELECT * FROM orders WHERE order_id = ? AND is_deleted = 0";
  db.query(sqlString, [order_id], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

Orders.getByUserId = (user_id, callback) => {
  const sqlString = "SELECT * FROM orders WHERE user_id = ? AND is_deleted = 0 ORDER BY created_at DESC";
  db.query(sqlString, [user_id], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

Orders.getAll = (callback) => {
  const sqlString = "SELECT * FROM orders WHERE is_deleted = 0";
  db.query(sqlString, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

Orders.insert = (orders, callBack) => {
  const sqlString = "INSERT INTO orders SET ?";
  db.query(sqlString, orders, (err, res) => {
    if (err) return callBack(err);
    callBack(null, { order_id: res.insertId, ...orders });
  });
};

Orders.update = (orders, order_id, callBack) => {
  const sqlString = "UPDATE orders SET ? WHERE order_id = ?";
  db.query(sqlString, [orders, order_id], (err, res) => {
    if (err) return callBack(err);
    callBack(null, `Cập nhật Orders có order_id = ${order_id} thành công`);
  });
};

Orders.delete = (order_id, callBack) => {
  // db.query(`DELETE FROM orders WHERE order_id = ?`, [order_id], (err, res) => {
  db.query(`UPDATE orders SET is_deleted = TRUE WHERE order_id = ?`, [order_id], (err, res) => {
    if (err) return callBack(err);
    callBack(null, `Xóa Orders có order_id = ${order_id} thành công`);
  });
};

module.exports = Orders;
