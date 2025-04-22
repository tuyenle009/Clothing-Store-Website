import { useState, useEffect } from "react";
import Link from 'next/link';  // Import Link từ Next.js
import { useRouter } from 'next/router';
import axios from 'axios';
import { CartService } from '../../pages/pages/user/shopping_basket/cartService';

const AppHeaderUser = () => {
    const router = useRouter();
    const [cartCount, setCartCount] = useState(0);
    const [user, setUser] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);

    // Hàm để lấy số lượng sản phẩm trong giỏ hàng từ database
    const fetchCartCount = async (userId) => {
        try {
            console.log('Fetching cart count for user:', userId); // Debug log
            const count = await CartService.getCartCount(userId);
            console.log('Cart count received:', count); // Debug log
            setCartCount(count);
            localStorage.setItem('cartCount', count.toString());
        } catch (error) {
            console.error('Error fetching cart count:', error);
            const savedCount = localStorage.getItem('cartCount');
            setCartCount(savedCount ? parseInt(savedCount) : 0);
        }
    };

    useEffect(() => {
        const initializeUserAndCart = async () => {
            try {
                // Lấy thông tin user từ localStorage
                const userData = localStorage.getItem('user');
                if (userData) {
                    const parsedUser = JSON.parse(userData);
                    setUser(parsedUser);
                    
                    // Lấy số lượng giỏ hàng từ database khi user đăng nhập
                    await fetchCartCount(parsedUser.user_id);
                } else {
                    // Reset cart count khi không có user
                    setCartCount(0);
                    localStorage.removeItem('cartCount');
                }
            } catch (error) {
                console.error('Error initializing user and cart:', error);
            }
        };

        initializeUserAndCart();

        // Lắng nghe sự kiện cập nhật giỏ hàng
        const handleCartUpdate = async (event) => {
            const userData = localStorage.getItem('user');
            if (userData) {
                const parsedUser = JSON.parse(userData);
                await fetchCartCount(parsedUser.user_id);
            }
        };

        window.addEventListener('cartUpdated', handleCartUpdate);

        // Cleanup
        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
        };
    }, []);

    const handleLogout = () => {
        localStorage.clear(); // Xóa tất cả dữ liệu trong localStorage
        setCartCount(0);
        setUser(null);
        router.push('/auth/login');
    };

    return (
        <div id = "user-header">
            <div id="logo">
                <Link href="/">
                    <img src="/users/img/logo.png" alt="SIXDO Logo" />
                </Link>
            </div>
            <div id="menu-header">
                <div className="header-icons">
                    <div className="user-menu" 
                         style={{ position: 'relative', display: 'inline-block' }}
                         onMouseEnter={() => setShowDropdown(true)}
                         onMouseLeave={() => setShowDropdown(false)}>
                        <img src="/users/icon/user.png" alt="User Icon" style={{ paddingRight: "10px" }} />
                        
                        {user ? (
                            <>
                                <span style={{ 
                                    color: '#333',
                                    textDecoration: 'none',
                                    fontSize: '15px',
                                    marginRight: '20px',
                                    cursor: 'pointer'
                                }}>
                                    {user.full_name}
                                </span>
                                {showDropdown && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: '0',
                                        backgroundColor: '#fff',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                                        borderRadius: '4px',
                                        padding: '8px 0',
                                        zIndex: 1000,
                                        minWidth: '120px'
                                    }}>
                                        <Link href="/pages/user/my_account" style={{
                                            display: 'block',
                                            padding: '8px 16px',
                                            color: '#333',
                                            textDecoration: 'none',
                                            fontSize: '14px'
                                        }}>
                                            My Account
                                        </Link>
                                        <Link href="/pages/user/purchase_order" style={{
                                            display: 'block',
                                            padding: '8px 16px',
                                            color: '#333',
                                            textDecoration: 'none',
                                            fontSize: '14px'
                                        }}>
                                            Purchase Order
                                        </Link>
                                        <a href="#" 
                                           onClick={(e) => {
                                               e.preventDefault();
                                               handleLogout();
                                           }}
                                           style={{
                                               display: 'block',
                                               padding: '8px 16px',
                                               color: '#333',
                                               textDecoration: 'none',
                                               fontSize: '14px'
                                           }}>
                                            Logout
                                        </a>
                                    </div>
                                )}
                            </>
                        ) : (
                            <Link href="/auth/login">LOGIN</Link>
                        )}
                    </div>

                    <img src="/users/icon/search-13-16.png" alt="Search Icon" style={{ paddingRight: "10px" }} />
                    <a href="#">Search</a>
                    <a href="#">VN | EN</a>
                    <img src="/users/icon/shopping-cart-16.png" alt="Cart Icon" style={{ padding: "0px 10px" }} />
                    <Link href="/pages/user/shopping_basket" id="shopping-cart">({cartCount})</Link>
                </div>
                <nav>
                    <ul>
                        <li>
                            <Link href="/pages/user/products">
                                NEW PRODUCT
                            </Link>
                        </li>
                        <li><a href="#" className="nav-item">DISCOUNTED PRODUCT</a></li>
                        <li><a href="#" className="nav-item">PERFUME</a></li>
                        <li><a href="#" className="nav-item">HANDBAG</a></li>
                        <li><a href="#" className="nav-item">ACCESSORIES</a></li>
                        <li><a href="#" className="nav-item">COLLECTION</a></li>
                        <li><a href="#" className="nav-item">FASHION SHOW</a></li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default AppHeaderUser;
