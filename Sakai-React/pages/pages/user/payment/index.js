import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { useRouter } from 'next/router';
import paymentService from './paymentService';
import { CartService } from '../shopping_basket/cartService';

const Payment = () => {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    note: ''
  });

  // Load user và cart data khi component mount
  useEffect(() => {
    // Kiểm tra đăng nhập
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/auth/login');
      return;
    }

    // Set user data
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setFormData({
      fullName: parsedUser.full_name || '',
      email: parsedUser.email || '',
      phone: parsedUser.phone || '',
      address: parsedUser.address || '',
      note: ''
    });

    // Load cart data
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      setCart(JSON.parse(cartData));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleSubmit = async () => {
    try {
      if (!user) {
        router.push('/auth/login');
        return;
      }

      // Validate form
      if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
        return;
      }

      // Tạo order
      const orderData = {
        user_id: user.user_id,
        total_price: calculateTotal(),
        order_status: 'pending',
        shipping_address: formData.address,
        phone: formData.phone,
        note: formData.note
      };
      const orderResponse = await paymentService.createOrder(orderData);

      // Tạo order details
      const orderDetailsPromises = cart.map(item => {
        return paymentService.createOrderDetails({
          order_id: orderResponse.order_id,
          detail_id: item.detail_id,
          quantity: item.quantity,
          price: item.price
        });
      });
      await Promise.all(orderDetailsPromises);

      // Tạo payment record
      await paymentService.createPayment({
        order_id: orderResponse.order_id,
        payment_method: 'COD',
        payment_status: 'pending'
      });

      // Xóa cart items từ database
      await CartService.clearUserCart(user.user_id);

      // Clear cart từ localStorage
      localStorage.removeItem('cart');
      localStorage.removeItem('cartTotal');
      localStorage.removeItem('cartCount');

      // Trigger event để update cart count trên header
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { count: 0 } }));

      // Redirect to purchase order page
      router.push('/pages/user/purchase_order');

    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  return (
    <main className="grid payment-page">
      <div className="col-8">
        <div className="card">
          <h2>Order Information</h2>
          <div className="grid">
            <div className="col-6">
              <div className="field">
                <label htmlFor="fullName">Full name *</label>
                <InputText
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full"
                  required
                />
              </div>
            </div>
            <div className="col-6">
              <div className="field">
                <label htmlFor="phone">Your Phone *</label>
                <InputText
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full"
                  required
                />
              </div>
            </div>
            <div className="col-12">
              <div className="field">
                <label htmlFor="email">Email *</label>
                <InputText
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full"
                  required
                />
              </div>
            </div>
            <div className="col-12">
              <div className="field">
                <label htmlFor="address">Address *</label>
                <InputText
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full"
                  required
                />
              </div>
            </div>
            <div className="col-12">
              <div className="field">
                <label htmlFor="note">Note</label>
                <InputTextarea
                  id="note"
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full"
                  placeholder="Example: Delivery during office hours"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-4">
        <div className="card">
          <h2>Your Order</h2>
          <div className="order-summary">
            {cart.map((item, index) => (
              <div key={index} className="order-item">
                <div className="grid">
                  <div className="col-8 product-info">
                    <span className="product-name">{item.quantity}x {item.name}</span>
                    <span className="product-details block">
                      Color: {item.color}
                    </span>
                    <span className="product-details block">
                      Size: {item.size}
                    </span>
                  </div>
                  <div className="col-4 product-price">
                    <span>
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }).format(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <div className="order-summary-box">
              <div className="summary-row">
                <span className="label">Total payment</span>
                <span className="value">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  }).format(calculateTotal())}
                </span>
              </div>
            </div>

            <div className="action-buttons">
              <Button
                label="CONFIRM"
                className="p-button-raised"
                onClick={handleSubmit}
              />
              <Button
                label="Continue shopping"
                className="p-button-text"
                onClick={() => router.push('/pages/user/products')}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Payment;
