import React, { useState } from "react";
import axios from "axios";
import Link from 'next/link';
import { useRouter } from 'next/router';

const Register = () => {
    const router = useRouter();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        try {
            const response = await axios.post("http://localhost:5000/auth/register", {
                full_name: fullName,
                email: email,
                password: password,
                phone: phone,
                address: address
            });

            if (response.data && response.data.user_id) {
                router.push('/auth/login');
            }
        } catch (error) {
            console.error("Registration error:", error);
            setError(error.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.");
        }
    };

    return (
        <div id = "register-body">
            {/* Header */}
            <div id = "register-header">
                <div id="register-logo-header">
                    <Link href="/">
                        <img src="/users/img/logo.png" alt="SIXDO Logo" />
                    </Link>
                </div>
                <div id="register-help">
                    <a href="#">Do you need help?</a>
                </div>
            </div>

            {/* Main content */}
            <main>
                <div id="register-logo-container">
                    <img src="/users/img/logo.png" alt="SixDO" />
                </div>
                <div id="regis-container">
                    <h2>Sign Up</h2>
                    <p>It's quick and easy.</p>
                    {error && <p className="error-message">{error}</p>}
                    <div className="register-form-group">
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>
                    <div className="register-form-group">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="register-form-group">
                        <input
                            type="password"
                            placeholder="New password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="register-form-group">
                        <input
                            type="text"
                            placeholder="Phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    <div className="register-form-group">
                        <textarea
                            placeholder="Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '8px',
                                boxSizing: 'border-box',
                                minHeight: '80px',
                                resize: 'vertical'
                            }}
                        />
                    </div>
                    <button className="register-btn" onClick={handleSubmit}>
                        Sign Up
                    </button>
                </div>
            </main>

            {/* Footer */}
            <div id="register-footer">
                    <p>SIXDO LLC</p>
                    <p>Responsible for Content Management: TynLee</p>
                    <p>Business Registration Number: 0344001111 issued by the Hanoi Department of Planning and Investment on February 10, 2015</p>
                    <p>© 2015 - Copyright belongs to TynLee</p>
            </div>
        </div>
    );
};

Register.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
        </React.Fragment>
    );
};

export default Register;
