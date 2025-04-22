const db = require("../common/db");

const Users = (users) => {
  this.user_id = users.user_id;
  this.full_name = users.full_name;
  this.email = users.email;
  this.password_hash = users.password_hash;
  this.phone = users.phone;
  this.address = users.address;
  this.role = users.role;
  this.created_at = users.created_at;
  this.is_deleted = users.is_deleted;
};

Users.getById = (user_id, callback) => {
  const sqlString = "SELECT * FROM users WHERE user_id = ?";
  db.query(sqlString, [user_id], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

Users.getAll = (callback) => {
  const sqlString = "SELECT * FROM users WHERE is_deleted = 0";
  db.query(sqlString, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

Users.insert = (users, callBack) => {
  const sqlString = "INSERT INTO users SET ?";
  db.query(sqlString, users, (err, res) => {
    if (err) return callBack(err);
    callBack(null, { user_id: res.insertId, ...users });
  });
};

Users.update = (users, user_id, callBack) => {
  // Log để debug
  console.log('Updating user with data:', users);
  console.log('For user_id:', user_id);

  const sqlString = "UPDATE users SET ? WHERE user_id = ?";
  db.query(sqlString, [users, user_id], (err, res) => {
    if (err) {
      console.error('Database error:', err);
      return callBack(err);
    }
    
    // Kiểm tra xem có row nào được update không
    if (res.affectedRows === 0) {
      return callBack(new Error('Không tìm thấy user để cập nhật'));
    }

    // Lấy thông tin user sau khi update
    const selectSql = "SELECT * FROM users WHERE user_id = ?";
    db.query(selectSql, [user_id], (err, result) => {
      if (err) {
        console.error('Error fetching updated user:', err);
        return callBack(err);
      }

      if (result.length === 0) {
        return callBack(new Error('Không thể lấy thông tin user sau khi cập nhật'));
      }

      // Trả về thông tin user đã được cập nhật
      const updatedUser = result[0];
      delete updatedUser.password_hash; // Loại bỏ thông tin nhạy cảm
      callBack(null, updatedUser);
    });
  });
};

Users.delete = (user_id, callBack) => {
  // db.query(`DELETE FROM users WHERE user_id = ?`, [user_id], (err, res) => {
  db.query(`UPDATE users SET is_deleted = TRUE WHERE user_id = ?`, [user_id], (err, res) => {
    if (err) return callBack(err);
    callBack(null, `Xóa Users có user_id = ${user_id} thành công`);
  });
};

// Thêm phương thức lấy người dùng theo email
Users.getByEmail = (email, callback) => {
  const sqlString = "SELECT * FROM users WHERE email = ?";
  db.query(sqlString, [email], (err, result) => {
      if (err) return callback(err);
      if (result.length > 0) {
          callback(null, result[0]);  // Trả về thông tin người dùng đầu tiên tìm thấy
      } else {
          callback(null, null);  // Nếu không tìm thấy người dùng
      }
  });
};

Users.updatePassword = (user_id, password_hash, callBack) => {
    const sqlString = "UPDATE users SET password_hash = ? WHERE user_id = ?";
    db.query(sqlString, [password_hash, user_id], (err, res) => {
        if (err) return callBack(err);
        callBack(null, `Cập nhật mật khẩu cho user_id = ${user_id} thành công`);
    });
};

module.exports = Users;
