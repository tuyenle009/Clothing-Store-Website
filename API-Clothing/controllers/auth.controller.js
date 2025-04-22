const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/users.model');  // Import model Users

// Đăng nhập
exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!email || !password) {
        return res.status(400).json({ message: 'Email và mật khẩu là bắt buộc' });
    }

    // Tìm người dùng theo email
    Users.getByEmail(email, (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Kiểm tra mật khẩu
        bcrypt.compare(password, user.password_hash, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ message: 'Error comparing password' });
            }

            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }

            // Nếu mật khẩu đúng, tạo JWT token
            const payload = {
                user_id: user.user_id,
                email: user.email,
                full_name: user.full_name,
                role: user.role,
            };

            // Sử dụng biến môi trường hoặc fallback vào key cứng
            const secretKey = process.env.JWT_SECRET || 'yourSecretKey';
            const options = { 
                expiresIn: process.env.JWT_EXPIRES_IN || '1h' 
            };

            const token = jwt.sign(payload, secretKey, options);

            // Trả token về cho client
            res.status(200).json({
                message: 'Login successful',
                token,
                user: {
                    user_id: user.user_id,
                    email: user.email,
                    full_name: user.full_name,
                    role: user.role
                }
            });
        });
    });
};

// Đăng ký tài khoản mới
exports.register = async (req, res) => {
    const { full_name, email, password, phone, address } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!full_name || !email || !password) {
        return res.status(400).json({ message: 'Tên, email và mật khẩu là bắt buộc' });
    }

    // Kiểm tra xem email đã tồn tại chưa
    Users.getByEmail(email, (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (user) {
            return res.status(400).json({ message: 'Email đã được đăng ký' });
        }

        // Mã hóa mật khẩu
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                return res.status(500).json({ message: 'Error hashing password' });
            }

            // Tạo người dùng mới
            const newUser = {
                full_name,
                email,
                password_hash: hash,
                phone: phone || null,
                address: address || null,
                role: 'customer', // Đổi thành 'customer' theo định nghĩa ENUM trong bảng
                created_at: new Date().toISOString().slice(0, 19).replace('T', ' '), // Format YYYY-MM-DD HH:MM:SS
                is_deleted: 0 // Giá trị cho trường is_deleted
            };

            // Log để debug
            console.log('Đang tạo người dùng mới:', newUser);

            // Lưu người dùng vào database
            Users.insert(newUser, (err, result) => {
                if (err) {
                    console.error('Lỗi khi tạo người dùng:', err);
                    return res.status(500).json({ message: 'Error creating user' });
                }

                res.status(201).json({
                    message: 'User registered successfully',
                    user_id: result.user_id
                });
            });
        });
    });
};
