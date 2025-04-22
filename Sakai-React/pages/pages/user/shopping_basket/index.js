import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import Link from 'next/link';
import { CartService } from './cartService';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';

const ShoppingBasket = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const userData = localStorage.getItem('user');
            if (!userData) {
                router.push('/auth/login');
                return;
            }

            const user = JSON.parse(userData);
            console.log('Fetching cart for user:', user); // Debug log

            const cartData = await CartService.getUserCart(user.user_id);
            console.log('Cart data received:', cartData); // Debug log

            if (cartData && cartData.length > 0) {
                console.log('Setting cart items:', cartData); // Debug log
                setCartItems(cartData);
                calculateTotal(cartData);
            } else {
                console.log('No items in cart'); // Debug log
                setCartItems([]);
                setTotalPrice(0);
            }
        } catch (error) {
            console.error('Error fetching cart items:', error);
            setError('Failed to load your shopping cart. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const calculateTotal = (items) => {
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        console.log('Calculated total:', total); // Debug log
        setTotalPrice(total);
    };

    const updateQuantity = async (cartItemId, productId, newQuantity, stockQuantity) => {
        if (newQuantity < 1) return;
        if (newQuantity > stockQuantity) {
            console.error(`Only ${stockQuantity} items available in stock`);
            return;
        }
        
        try {
            const userData = JSON.parse(localStorage.getItem('user'));
            await CartService.updateCartItemQuantity(cartItemId, userData.user_id, productId, newQuantity);
            
            const updatedCart = cartItems.map(item => 
                item.id === cartItemId 
                    ? { ...item, quantity: newQuantity }
                    : item
            );
            
            setCartItems(updatedCart);
            calculateTotal(updatedCart);

            const newCount = await CartService.getCartCount(userData.user_id);
            window.dispatchEvent(new CustomEvent('cartUpdated', { 
                detail: { count: newCount } 
            }));
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const removeItem = async (cartItemId) => {
        try {
            await CartService.removeFromCart(cartItemId);
            
            const updatedCart = cartItems.filter(item => item.id !== cartItemId);
            setCartItems(updatedCart);
            calculateTotal(updatedCart);

            const userData = JSON.parse(localStorage.getItem('user'));
            const newCount = await CartService.getCartCount(userData.user_id);
            window.dispatchEvent(new CustomEvent('cartUpdated', { 
                detail: { count: newCount } 
            }));
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const handleProceedToCheckout = () => {
        try {
            localStorage.setItem('cart', JSON.stringify(cartItems));
            localStorage.setItem('cartTotal', totalPrice.toString());
            router.push('/pages/user/payment');
        } catch (error) {
            console.error('Error saving cart to localStorage:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-content-center align-items-center" style={{ height: '70vh' }}>
                <ProgressSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-content-center align-items-center" style={{ height: '70vh' }}>
                <Message severity="error" text={error} />
                <button className="p-button p-button-text" onClick={fetchCartItems}>Try Again</button>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="flex align-items-center justify-content-between mb-4">
                <h1 className="text-3xl font-bold">Shopping Cart</h1>
                <div className="text-500">
                    <Link href="/pages/user/home_page" className="no-underline text-blue-500 hover:text-blue-700">Home</Link>
                    <span className="mx-2">/</span>
                    <Link href="/pages/user/products" className="no-underline text-blue-500 hover:text-blue-700">Products</Link>
                    <span className="mx-2">/</span>
                    <span className="text-700">Shopping Cart</span>
                </div>
            </div>
      
            {cartItems.length === 0 ? (
                <div className="text-center py-8">
                    <i className="pi pi-shopping-cart text-6xl text-500 mb-4"></i>
                    <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
                    <p className="text-500 mb-4">Looks like you haven't added anything to your cart yet.</p>
                    <button 
                        className="p-button p-button-primary" 
                        onClick={() => router.push('/pages/user/products')}
                    >
                        Continue Shopping
                    </button>
                </div>
            ) : (
                <div className="grid">
                    <div className="col-12 lg:col-8">
                        <div className="card">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex flex-column lg:flex-row p-3 border-bottom-1 surface-border">
                                    <div className="w-full lg:w-3rem mr-3">
                                        <img 
                                            src={item.image} 
                                            alt={item.name} 
                                            className="w-full shadow-1"
                                            onError={(e) => e.target.src = '/users/img/product-placeholder.png'}
                                        />
                                    </div>
                                    <div className="flex-auto">
                                        <div className="flex align-items-center justify-content-between mb-2">
                                            <Link 
                                                href={`/pages/user/product_detail/${item.product_id}`}
                                                className="text-900 font-medium text-lg no-underline hover:text-primary"
                                            >
                                                {item.name}
                                            </Link>
                                            <button 
                                                className="p-button p-button-text p-button-rounded p-button-danger"
                                                onClick={() => removeItem(item.id)}
                                            >
                                                <i className="pi pi-times"></i>
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-3 mb-2">
                                            <span className="inline-flex align-items-center px-2 py-1 text-xs font-semibold text-primary-900 bg-primary-100 rounded-md">
                                                Color: {item.color}
                                            </span>
                                            <span className="inline-flex align-items-center px-2 py-1 text-xs font-semibold text-primary-900 bg-primary-100 rounded-md">
                                                Size: {item.size}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap justify-content-between align-items-center">
                                            <span className="text-900 font-medium text-lg">
                                                {new Intl.NumberFormat('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                    minimumFractionDigits: 0,
                                                    maximumFractionDigits: 0
                                                }).format(item.price)}
                                            </span>
                                            <div className="flex align-items-center gap-3">
                                                <div className="flex align-items-center">
                                                    <button 
                                                        className="p-button p-button-text p-button-rounded"
                                                        onClick={() => updateQuantity(item.id, item.product_id, item.quantity - 1, item.stock_quantity)}
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <i className="pi pi-minus"></i>
                                                    </button>
                                                    <span className="mx-2 text-900 font-medium">{item.quantity}</span>
                                                    <button 
                                                        className="p-button p-button-text p-button-rounded"
                                                        onClick={() => updateQuantity(item.id, item.product_id, item.quantity + 1, item.stock_quantity)}
                                                        disabled={item.quantity >= item.stock_quantity}
                                                    >
                                                        <i className="pi pi-plus"></i>
                                                    </button>
                                                </div>
                                                <span className="text-500 text-sm">
                                                    (Stock: {item.stock_quantity})
                                                </span>
                                            </div>
                                            <span className="text-900 font-medium text-lg">
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
                        </div>
                    </div>
                    <div className="col-12 lg:col-4">
                        <div className="card">
                            <h3 className="text-xl font-semibold mb-3">Order Summary</h3>
                            <div className="flex justify-content-between mb-2">
                                <span>Subtotal ({cartItems.length} items)</span>
                                <span className="font-medium">
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0
                                    }).format(totalPrice)}
                                </span>
                            </div>
                            <div className="flex justify-content-between mb-2">
                                <span>Shipping</span>
                                <span className="font-medium text-green-500">Free</span>
                            </div>
                            <hr className="my-3" />
                            <div className="flex justify-content-between mb-4">
                                <span className="font-medium text-lg">Total</span>
                                <span className="font-bold text-lg">
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0
                                    }).format(totalPrice)}
                                </span>
                            </div>
                            <button 
                                className="p-button p-button-primary w-full mb-3"
                                onClick={handleProceedToCheckout}
                                disabled={cartItems.length === 0}
                            >
                                Proceed to Checkout
                            </button>
                            <button 
                                className="p-button p-button-outlined w-full"
                                onClick={() => router.push('/pages/user/products')}
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShoppingBasket;
