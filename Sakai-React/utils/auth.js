// Tạo file Sakai-React/utils/auth.js

// Lưu thông tin user vào localStorage
export const setUserData = (userData) => {
    if (typeof window !== 'undefined') {
        // Chỉ lưu những thông tin cần thiết và không nhạy cảm
        const essentialUserData = {
            user_id: userData.user_id,
            full_name: userData.full_name,
            email: userData.email,
            phone: userData.phone,
            address: userData.address,
            role: userData.role
        };
        localStorage.setItem('user', JSON.stringify(essentialUserData));
    }
};

// Lưu token vào localStorage
export const setAuthToken = (token) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
    }
};

// Lấy thông tin user từ localStorage
export const getUserData = () => {
    if (typeof window !== 'undefined') {
        try {
            const userData = localStorage.getItem('user');
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Error parsing user data:', error);
            return null;
        }
    }
    return null;
};

// Kiểm tra xem user đã đăng nhập hay chưa
export const isLoggedIn = () => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        const user = getUserData();
        return !!(token && user);
    }
    return false;
};

// Kiểm tra xem user có vai trò admin hay không
export const isAdmin = () => {
    const user = getUserData();
    return user && user.role === 'admin';
};

// Lấy token từ localStorage
export const getAuthToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
};

// Tạo header chuẩn cho API request có kèm token
export const getAuthHeader = () => {
    const token = getAuthToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Log user out - xóa toàn bộ thông tin khỏi localStorage
export const logout = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Xóa các thông tin khác nếu có
        localStorage.removeItem('cartCount');
        window.location.href = '/auth/login';
    }
};