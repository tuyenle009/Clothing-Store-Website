const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const Users = require('../models/users.model');
const bcrypt = require('bcrypt');

// Import controller (nếu cần)
// const userController = require('../controllers/user.controller');

// Route lấy thông tin profile người dùng
router.get('/profile', verifyToken, (req, res) => {
    const userId = req.user.user_id;
    Users.getById(userId, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: 'Lỗi khi lấy thông tin người dùng',
                error: err
            });
        }
        if (result && result.length > 0) {
            const user = result[0];
            // Loại bỏ thông tin nhạy cảm
            delete user.password_hash;
            res.status(200).json({
                message: 'Lấy thông tin thành công',
                user: user
            });
        } else {
            res.status(404).json({
                message: 'Không tìm thấy thông tin người dùng'
            });
        }
    });
});

// Route đổi mật khẩu - cần xác thực token
router.post('/change-password', verifyToken, async (req, res) => {
    const userId = req.user.user_id;
    const { oldPassword, newPassword } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!oldPassword || !newPassword) {
        return res.status(400).json({
            message: 'Vui lòng cung cấp mật khẩu cũ và mật khẩu mới'
        });
    }

    try {
        // Lấy thông tin user từ database
        Users.getById(userId, async (err, result) => {
            if (err) {
                console.error('Error getting user:', err);
                return res.status(500).json({
                    message: 'Lỗi khi lấy thông tin người dùng'
                });
            }

            if (!result || result.length === 0) {
                return res.status(404).json({
                    message: 'Không tìm thấy thông tin người dùng'
                });
            }

            const user = result[0];

            try {
                // Kiểm tra mật khẩu cũ
                const isValidPassword = await bcrypt.compare(oldPassword, user.password_hash);
                
                if (!isValidPassword) {
                    return res.status(400).json({
                        message: 'Mật khẩu cũ không chính xác'
                    });
                }

                // Mã hóa mật khẩu mới
                const saltRounds = 10;
                const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

                // Cập nhật mật khẩu mới
                Users.updatePassword(userId, hashedNewPassword, (updateErr, updateResult) => {
                    if (updateErr) {
                        console.error('Error updating password:', updateErr);
                        return res.status(500).json({
                            message: 'Lỗi khi cập nhật mật khẩu'
                        });
                    }

                    res.status(200).json({
                        message: 'Đổi mật khẩu thành công'
                    });
                });
            } catch (bcryptError) {
                console.error('Bcrypt error:', bcryptError);
                return res.status(500).json({
                    message: 'Lỗi khi xử lý mật khẩu'
                });
            }
        });
    } catch (error) {
        console.error('Password change error:', error);
        res.status(500).json({
            message: 'Lỗi server khi đổi mật khẩu'
        });
    }
});

// Route cập nhật thông tin cá nhân
router.put('/update-profile', verifyToken, (req, res) => {
    const userId = req.user.user_id;
    const updateData = {
        full_name: req.body.full_name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address
    };

    // Log dữ liệu nhận được để debug
    console.log('Received update data:', updateData);
    console.log('User ID:', userId);

    // Kiểm tra và loại bỏ các trường undefined hoặc null
    Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined || updateData[key] === null || updateData[key] === '') {
            delete updateData[key];
        }
    });

    // Log dữ liệu sau khi lọc
    console.log('Filtered update data:', updateData);

    // Kiểm tra xem còn dữ liệu để update không
    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
            message: 'Không có dữ liệu để cập nhật'
        });
    }

    Users.update(updateData, userId, (err, updatedUser) => {
        if (err) {
            console.error('Update error:', err);
            return res.status(500).json({
                message: 'Lỗi khi cập nhật thông tin',
                error: err.message
            });
        }

        res.status(200).json({
            message: 'Cập nhật thông tin thành công',
            user: updatedUser
        });
    });
});

module.exports = router; 