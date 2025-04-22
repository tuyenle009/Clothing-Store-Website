import React from "react";

const AppFooterUser = () => {
    return (
        <div id = "user-footer">
            <div className="footer-content">
                <div className="footer-section">
                    <img className="footer-img" src="/users/icon/time.png" alt="Time Icon" />
                    <p className="footer-strong-p">6 DAYS FOR EXCHANGE PRODUCTS</p>
                    <p>6 days for exchange / return products</p>
                </div>
                <div className="footer-section">
                    <img className="footer-img" src="/users/icon/call.png" alt="Call Icon" />
                    <p className="footer-strong-p">HOTLINE 1800 6650</p>
                    <p>8:00-21:00, Monday-Sunday, Lunar New Year holiday</p>
                </div>
                <div className="footer-section">
                    <img className="footer-img" src="/users/icon/shop.png" alt="Shop Icon" />
                    <p className="footer-strong-p">SHOP SYSTEM</p>
                    <p>Nearly 60 stores in Vietnam</p>
                </div>
                <div className="footer-section">
                    <img className="footer-img" src="/users/icon/car.png" alt="Car Icon" />
                    <p className="footer-strong-p">TRANSPORT</p>
                    <p>Same price 25K nationwide</p>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="footer-links">
                    <div className="footer-links-section">
                        <h4>Contact</h4>
                        <p>We specialize in providing high-quality clothing products for everyone</p>
                        <p>📍 268 Cau Giay, Ha Noi, Vietnam</p>
                        <p>📞 0344001211</p>
                        <p>📧 leductuyen@gmail.com</p>
                    </div>
                    <div className="footer-links-section">
                        <h4>CATEGORY</h4>
                        <ul>
                            <li>Home</li>
                            <li>Products</li>
                            <li>News</li>
                            <li>Contact</li>
                            <li>Demo</li>
                        </ul>
                    </div>
                    <div className="footer-links-section">
                        <h4>CUSTOMER SUPPORT</h4>
                        <ul>
                            <li>Home</li>
                            <li>Products</li>
                            <li>News</li>
                            <li>Contact</li>
                            <li>Demo</li>
                        </ul>
                    </div>
                    <div className="footer-links-section">
                        <h4>CONNECT WITH SIXDO</h4>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3726.2560430590543!2d106.0574224096648!3d20.942230390666598!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135a30555555555%3A0x39a8acd006ab8e69!2sHung%20Yen%20University%20of%20Technology%20and%20Education%2C%20Campus%202!5e0!3m2!1sen!2s!4v1718404443883!5m2!1sen!2s"
                            width="600" height="450" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade">
                        </iframe>
                    </div>
                </div>
                <p style={{ textAlign: "center", paddingTop: "15px", borderTop: "1px solid rgb(227, 221, 187)" }}>2020 Sixdo.vn</p>
            </div>
        </div>
    );
};

export default AppFooterUser;