import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { API_ENDPOINTS } from '../../../../config/api';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';

const ProductDetail = () => {
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const toast = useRef(null);
    const { id } = router.query;

    useEffect(() => {
        if (id) {
            fetchProductDetail();
        }
    }, [id]);

    const fetchProductDetail = async () => {
        try {
            const response = await axios.get(`${API_ENDPOINTS.PRODUCTS}/${id}`);
            setProduct(response.data);
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async () => {
        try {
            // Kiểm tra user đã đăng nhập chưa
            const userData = JSON.parse(localStorage.getItem('user'));
            if (!userData) {
                router.push('/auth/login');
                return;
            }

            // Kiểm tra số lượng hợp lệ
            if (quantity < 1) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Quantity must be at least 1',
                    life: 3000
                });
                return;
            }

            // Gọi API để thêm vào giỏ hàng
            const response = await axios.post(API_ENDPOINTS.CART, {
                user_id: userData.user_id,
                product_id: product.product_id,
                quantity: quantity
            });

            if (response.data) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Product added to cart successfully',
                    life: 3000
                });

                // Tùy chọn: chuyển đến trang giỏ hàng
                // router.push('/pages/user/shopping_basket');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to add product to cart',
                life: 3000
            });
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <div className="product-detail">
            <Toast ref={toast} />
            {/* Hiển thị thông tin sản phẩm */}
            <div className="product-info">
                <img src={product.image} alt={product.name} />
                <h2>{product.name}</h2>
                <p className="price">{product.price.toLocaleString('vi-VN')}₫</p>
                <div className="quantity-selector">
                    <button 
                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                        className="quantity-btn"
                    >
                        -
                    </button>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        min="1"
                    />
                    <button 
                        onClick={() => setQuantity(prev => prev + 1)}
                        className="quantity-btn"
                    >
                        +
                    </button>
                </div>
                <button 
                    className="add-to-cart-btn"
                    onClick={addToCart}
                >
                    Add to Cart
                </button>
            </div>
            {/* Thêm các thông tin chi tiết khác của sản phẩm */}
        </div>
    );
};

export default ProductDetail; 