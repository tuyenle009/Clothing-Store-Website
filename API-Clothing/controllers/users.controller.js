const Users = require("../models/users.model");
const bcrypt = require('bcrypt');

module.exports = {
  getAll: (req, res) => {
    Users.getAll((err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    Users.getById(id, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  getProfile: (req, res) => {
    // Lấy user_id từ token đã được xác thực trong middleware
    const userId = req.user.user_id;
    Users.getById(userId, (err, result) => {
      if (err) return res.status(500).send(err);
      
      // Loại bỏ thông tin nhạy cảm như mật khẩu trước khi trả về
      if (result.length > 0) {
        const user = result[0];
        delete user.password_hash;
        res.send(user);
      } else {
        res.status(404).send({ message: 'Không tìm thấy thông tin người dùng' });
      }
    });
  },

  insert: (req, res) => {
    const data = req.body;

    // Tự động tạo ngày tạo nếu không có
    if (!data.created_at) {
        data.created_at = new Date().toISOString().slice(0, 19).replace("T", " ");
    } else {
        // Chuyển đổi thời gian về múi giờ Việt Nam (UTC+7)
        const date = new Date(data.created_at);
        date.setHours(date.getHours() + 7);
        data.created_at = date.toISOString().slice(0, 19).replace("T", " ");
    }

    Users.insert(data, (err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result);
    });
  },

  update: (req, res) => {
    const data = req.body;
    const id = req.params.id;
    
    // Không cho phép cập nhật ngày tạo
    delete data.created_at;
    
    if (data.created_at) {
        // Chuyển đổi thời gian về múi giờ Việt Nam (UTC+7)
        const date = new Date(data.created_at);
        date.setHours(date.getHours() + 7);
        data.created_at = date.toISOString().slice(0, 19).replace("T", " ");
    }

    Users.update(data, id, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    Users.delete(id, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  },

  changePassword: (req, res) => {
    const userId = req.params.id;
    const { newPassword } = req.body;

    if (!newPassword) {
        return res.status(400).send({ message: "Mật khẩu mới không được để trống" });
    }

    // Mã hóa mật khẩu mới
    const saltRounds = 10;
    bcrypt.hash(newPassword, saltRounds, (err, hash) => {
        if (err) {
            return res.status(500).send({ message: "Lỗi khi mã hóa mật khẩu" });
        }

        // Cập nhật mật khẩu trong database
        Users.updatePassword(userId, hash, (err, result) => {
            if (err) {
                return res.status(500).send({ message: "Lỗi khi cập nhật mật khẩu" });
            }
            res.send({ message: "Đổi mật khẩu thành công" });
        });
    });
  }
};
