// Sakai-React/components/ProtectedRoute.js
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { isLoggedIn, isAdmin } from '../utils/auth';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const router = useRouter();
    
    useEffect(() => {
        // Kiểm tra nếu người dùng đã đăng nhập
        const logged = isLoggedIn();
        
        if (!logged) {
            // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
            router.push('/auth/login');
        } else if (adminOnly && !isAdmin()) {
            // Chuyển hướng đến trang access denied nếu không phải admin
            router.push('/auth/access');
        }
    }, [router, adminOnly]);

    // Hiển thị loading hoặc children tùy thuộc vào trạng thái đăng nhập
    if (typeof window !== 'undefined') {
        const logged = isLoggedIn();
        if (!logged || (adminOnly && !isAdmin())) {
            return <div>Loading...</div>;
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;