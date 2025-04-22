import React, { useState } from 'react';
import Link from 'next/link';
import { API_ENDPOINTS } from '../../../config/api';
import { setUserData, setAuthToken } from '../../../utils/auth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(API_ENDPOINTS.LOGIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Lưu token và thông tin user
                setAuthToken(data.token);
                
                // Log response data để debug
                console.log('Login response:', data);

                try {
                    // Fetch đầy đủ thông tin profile ngay sau khi đăng nhập thành công
                    const profileResponse = await fetch('http://localhost:5000/user/profile', {
                        headers: {
                            'Authorization': `Bearer ${data.token}`
                        }
                    });
                    const profileData = await profileResponse.json();

                    if (profileResponse.ok && profileData.user) {
                        // Tạo object userData với đầy đủ thông tin từ profile
                        const userData = {
                            user_id: data.user.user_id,
                            full_name: data.user.full_name,
                            email: data.user.email,
                            phone: profileData.user.phone || '',
                            address: profileData.user.address || '',
                            role: data.user.role
                        };

                        // Log user data trước khi lưu
                        console.log('Saving complete user data:', userData);
                        
                        // Lưu vào localStorage
                        localStorage.setItem('user', JSON.stringify(userData));
                        setUserData(userData);
                    }
                } catch (profileError) {
                    console.error('Error fetching complete profile:', profileError);
                    // Nếu không lấy được profile đầy đủ, vẫn lưu thông tin cơ bản
                    const basicUserData = {
                        user_id: data.user.user_id,
                        full_name: data.user.full_name,
                        email: data.user.email,
                        phone: '',
                        address: '',
                        role: data.user.role
                    };
                    localStorage.setItem('user', JSON.stringify(basicUserData));
                    setUserData(basicUserData);
                }

                // Điều hướng người dùng dựa trên vai trò
                if (data.user.role === 'admin') {
                    window.location.href = '/pages/admin/dashboard';
                } else {
                    window.location.href = '/pages/user/home_page';
                }
            } else {
                setErrorMessage(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('An error occurred while logging in.');
        }
    };

    return (
        <div id="login-body">
            <div id="login-header">
                <div id="login-logo-header">
                    <Link href="/">
                        <img src="/users/img/logo.png" alt="SIXDO Logo" />
                    </Link>
                </div>
                <div id="login-help">
                    <a href="#">Do you need help?</a>
                </div>
            </div>

            <div id="login-main">
                <div id="login-logo-container">
                    <img src="/users/img/logo.png" alt="SixDO" />
                </div>
                <div id="login-container">
                    <h2>Log in</h2>
                    {errorMessage && <p className="error">{errorMessage}</p>}
                    <form onSubmit={handleLogin}>
                        <div className="login-form-group">
                            <label htmlFor="email">Email/Phone number/Username</label>
                            <input 
                                type="text" 
                                id="login-email" 
                                placeholder="Email/Phone number/Username" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="login-form-group">
                            <label htmlFor="password">Password</label>
                            <div className="password-input-container">
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    id="login-password" 
                                    placeholder="Password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <span 
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "👁️" : "👁️‍🗨️"}
                                </span>
                            </div>
                        </div>
                        <button type="submit" className="login-btn">LOG IN</button>
                    </form>
                    <a href="#" className="login-forgot-password">Forgot password</a>
                    <div className="login-social-login">
                        <a href="https://www.facebook.com/" className="facebook">Facebook</a>
                        <a href="https://www.google.com/" className="google">Google</a>
                    </div>
                    <p className="login-register">
                        Are you new to SixDo?&nbsp;
                        <Link href="register">
                            Register
                        </Link>
                    </p>
                </div>
            </div>

            <div id="login-footer">
                <p>SIXDO LLC</p>
                <p>Responsible for Content Management: TynLee</p>
                <p>Business Registration Number: 0344001111 issued by the Hanoi Department of Planning and Investment on February 10, 2015</p>
                <p>© 2015 - Copyright belongs to TynLee</p>
            </div>
        </div>
    );
}

Login.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
        </React.Fragment>
    );
};

export default Login;
