const db = require("../common/db");

function Cart(cart) {
  this.id = cart.id;
  this.user_id = cart.user_id;
  this.product_id = cart.product_id;
  this.detail_id = cart.detail_id;
  this.quantity = cart.quantity;
}

Cart.getById = (id, callback) => {
  const sqlString = "SELECT * FROM cart WHERE id = ?";
  db.query(sqlString, [id], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

Cart.getByUserId = (userId, callback) => {
  const sqlString = `
    SELECT 
      c.id,
      c.user_id,
      c.product_id,
      c.detail_id,
      c.quantity,
      p.product_name as name,
      p.price,
      p.image_url as image,
      pd.color,
      pd.size,
      pd.stock_quantity
    FROM cart c
    JOIN products p ON c.product_id = p.product_id
    JOIN product_details pd ON c.detail_id = pd.detail_id
    WHERE c.user_id = ? AND p.is_deleted = FALSE
    ORDER BY c.id DESC
  `;
  db.query(sqlString, [userId], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

Cart.getAll = (callback) => {
  const sqlString = "SELECT * FROM cart";
  db.query(sqlString, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

Cart.checkExistingItem = (userId, productId, detailId, callback) => {
  const sqlString = `
    SELECT c.*, pd.stock_quantity 
    FROM cart c
    JOIN product_details pd ON c.detail_id = pd.detail_id
    WHERE c.user_id = ? 
    AND c.product_id = ? 
    AND c.detail_id = ?
    LIMIT 1
  `;
  
  db.query(sqlString, [userId, productId, detailId], (err, result) => {
    if (err) return callback(err);
    callback(null, result[0]);
  });
};

Cart.insert = (cart, callback) => {
  Cart.checkExistingItem(cart.user_id, cart.product_id, cart.detail_id, (err, existingItem) => {
    if (err) return callback(err);

    if (existingItem) {
      const newQuantity = existingItem.quantity + cart.quantity;
      
      if (newQuantity > existingItem.stock_quantity) {
        return callback({
          status: 400,
          message: `Chỉ còn ${existingItem.stock_quantity} sản phẩm trong kho`
        });
      }

      const updateSql = "UPDATE cart SET quantity = ? WHERE id = ?";
      db.query(updateSql, [newQuantity, existingItem.id], (err, res) => {
        if (err) return callback(err);
        callback(null, { 
          id: existingItem.id, 
          ...cart, 
          quantity: newQuantity,
          message: 'Cập nhật số lượng thành công'
        });
      });
    } else {
      const insertSql = "INSERT INTO cart SET ?";
      db.query(insertSql, cart, (err, res) => {
        if (err) return callback(err);
        callback(null, { 
          id: res.insertId, 
          ...cart,
          message: 'Thêm vào giỏ hàng thành công'
        });
      });
    }
  });
};

Cart.update = (cart, id, callBack) => {
  const sqlString = "UPDATE cart SET ? WHERE id = ?";
  db.query(sqlString, [cart, id], (err, res) => {
    if (err) return callBack(err);
    callBack(null, `Cập nhật Cart có id = ${id} thành công`);
  });
};

Cart.delete = (id, callBack) => {
  db.query(`DELETE FROM cart WHERE id = ?`, [id], (err, res) => {
    if (err) return callBack(err);
    callBack(null, `Xóa Cart có id = ${id} thành công`);
  });
};

module.exports = Cart;
