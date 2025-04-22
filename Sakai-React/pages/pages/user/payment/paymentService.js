import axios from 'axios';
import { API_ENDPOINTS } from '../../../../config/api';

const getAuthHeader = () => {
    const user = localStorage.getItem('user');
    if (user) {
        const parsedUser = JSON.parse(user);
        return {
            headers: {
                'Authorization': `Bearer ${parsedUser.token}`,
                'Content-Type': 'application/json'
            }
        };
    }
    return {
        headers: {
            'Content-Type': 'application/json'
        }
    };
};

const paymentService = {
    createOrder: async (orderData) => {
        try {
            const response = await axios.post(API_ENDPOINTS.ORDERS, {
                user_id: orderData.user_id,
                total_price: orderData.total_price,
                order_status: 'pending',
                is_deleted: false
            }, getAuthHeader());
            return response.data;
        } catch (error) {
            console.error('Error creating order:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Error creating order');
        }
    },

    createOrderDetails: async (orderDetailsData) => {
        try {
            const response = await axios.post(API_ENDPOINTS.ORDER_DETAILS, {
                order_id: orderDetailsData.order_id,
                detail_id: orderDetailsData.detail_id,
                quantity: orderDetailsData.quantity,
                price: orderDetailsData.price
            }, getAuthHeader());
            return response.data;
        } catch (error) {
            console.error('Error creating order details:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Error creating order details');
        }
    },

    createPayment: async (paymentData) => {
        try {
            const response = await axios.post(API_ENDPOINTS.PAYMENTS, {
                order_id: paymentData.order_id,
                payment_method: 'COD',
                payment_status: 'pending',
                is_deleted: false
            }, getAuthHeader());
            return response.data;
        } catch (error) {
            console.error('Error creating payment:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Error creating payment');
        }
    }
};

export default paymentService;
