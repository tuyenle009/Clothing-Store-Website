const jwt = require('jsonwebtoken');

// Middleware xác thực token JWT
const verifyToken = (req, res, next) => {
    // Lấy token từ header Authorization
    const bearerHeader = req.headers['authorization'];
    
    // Kiểm tra xem token có tồn tại không
    if (!bearerHeader) {
        return res.status(401).json({ message: 'Không có token, từ chối truy cập' });
    }

    try {
        // Thường token được gửi dưới dạng: "Bearer [token]"
        const bearer = bearerHeader.split(' ');
        const token = bearer[1];

        // Kiểm tra xem token có hợp lệ không
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'yourSecretKey');
        
        // Lưu thông tin người dùng đã giải mã vào request để sử dụng trong các xử lý tiếp theo
        req.user = decoded;
        
        // Chuyển sang middleware tiếp theo
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
};

// Middleware kiểm tra vai trò admin
const isAdmin = (req, res, next) => {
    // Kiểm tra xem user đã được xác thực chưa
    if (!req.user) {
        return res.status(401).json({ message: 'Không có thông tin xác thực' });
    }

    // Kiểm tra vai trò của user
    if (req.user.role === 'admin') {
        next(); // Cho phép tiếp tục nếu là admin
    } else {
        return res.status(403).json({ message: 'Yêu cầu quyền admin' });
    }
};

module.exports = {
    verifyToken,
    isAdmin
}; 