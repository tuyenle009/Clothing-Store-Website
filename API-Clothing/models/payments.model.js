const db = require("../common/db");

const Payments = (payments) => {
  this.payment_id = payments.payment_id;
  this.order_id = payments.order_id;
  this.payment_method = payments.payment_method;
  this.payment_status = payments.payment_status;
  this.created_at = payments.created_at;
  this.is_deleted = payments.is_deleted;
};

Payments.getById = (payment_id, callback) => {
  const sqlString = "SELECT * FROM payments WHERE payment_id = ?";
  db.query(sqlString, [payment_id], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

Payments.getByOrderId = (orderId, callback) => {
  const sqlString = `
        SELECT * FROM payments 
        WHERE order_id = ? AND is_deleted = FALSE
        ORDER BY created_at DESC
        LIMIT 1
    `;
    
  db.query(sqlString, [orderId], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return callback(err);
    }
    callback(null, result);
  });
};

Payments.getAll = (callback) => {
  const sqlString = "SELECT * FROM payments";
  db.query(sqlString, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

Payments.insert = (payments, callBack) => {
  const sqlString = "INSERT INTO payments SET ?";
  db.query(sqlString, payments, (err, res) => {
    if (err) return callBack(err);
    callBack(null, { payment_id: res.insertId, ...payments });
  });
};

Payments.update = (payments, payment_id, callBack) => {
  const sqlString = "UPDATE payments SET ? WHERE payment_id = ?";
  db.query(sqlString, [payments, payment_id], (err, res) => {
    if (err) return callBack(err);
    callBack(null, `Cập nhật Payments có payment_id = ${payment_id} thành công`);
  });
};

Payments.delete = (payment_id, callBack) => {
  db.query(`DELETE FROM payments WHERE payment_id = ?`, [payment_id], (err, res) => {
    if (err) return callBack(err);
    callBack(null, `Xóa Payments có payment_id = ${payment_id} thành công`);
  });
};

module.exports = Payments;
