import axios from 'axios';
const API_URL = 'http://localhost:5000/orders';
const DETAIL_API_URL = 'http://localhost:5000/order_details';
const USER_API_URL = 'http://localhost:5000/users';

const getAuthToken = () => {
    return localStorage.getItem('token');
};

const getAuthHeader = () => {
    const token = getAuthToken();
    return {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
};

const orderService = {
    getAllOrders: async () => {
        try {
            const response = await axios.get(API_URL, getAuthHeader());
            return response.data;
        } catch (error) {
            console.error('Error details:', error.response?.data);
            throw new Error('Error fetching orders: ' + error.message);
        }
    },

    getAllUsers: async () => {
        try {
            const response = await axios.get(USER_API_URL, getAuthHeader());
            return response.data;
        } catch (error) {
            console.error('Error details:', error.response?.data);
            throw new Error('Error fetching users: ' + error.message);
        }
    },

    getOrderById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`, getAuthHeader());
            return response.data;
        } catch (error) {
            throw new Error('Error fetching order by ID: ' + error.message);
        }
    },

    addOrder: async (orderData) => {
        try {
            const { order_id, ...dataWithoutId } = orderData;
            const response = await axios.post(API_URL, dataWithoutId, getAuthHeader());
            return response.data;
        } catch (error) {
            throw new Error('Error adding order: ' + error.message);
        }
    },

    updateOrder: async (orderData) => {
        try {
            const response = await axios.put(`${API_URL}/${orderData.order_id}`, orderData, getAuthHeader());
            return response.data;
        } catch (error) {
            throw new Error('Error updating order: ' + error.message);
        }
    },

    deleteOrder: async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`, getAuthHeader());
        } catch (error) {
            throw new Error('Error deleting order: ' + error.message);
        }
    },

    // Order Details

    getOrderDetailById: async (id) => {
        try {
            const response = await axios.get(`${DETAIL_API_URL}/${id}`, getAuthHeader());
            return response.data;
        } catch (error) {
            throw new Error('Error fetching order detail by ID: ' + error.message);
        }
    },

    getOrderDetailsByOrderId: async (orderId) => {
        try {
            const response = await axios.get(`${DETAIL_API_URL}/order/${orderId}`, getAuthHeader());
            return response.data;
        } catch (error) {
            throw new Error('Error fetching order details by order ID: ' + error.message);
        }
    },

    addOrderDetail: async (orderDetailData) => {
        try {
            const { order_detail_id, ...dataWithoutId } = orderDetailData;
            const response = await axios.post(DETAIL_API_URL, dataWithoutId, getAuthHeader());
            return response.data;
        } catch (error) {
            throw new Error('Error adding order detail: ' + error.message);
        }
    },

    updateOrderDetail: async (orderDetailData) => {
        try {
            const response = await axios.put(`${DETAIL_API_URL}/${orderDetailData.order_detail_id}`, orderDetailData, getAuthHeader());
            return response.data;
        } catch (error) {
            throw new Error('Error updating order detail: ' + error.message);
        }
    },

    deleteOrderDetail: async (id) => {
        try {
            await axios.delete(`${DETAIL_API_URL}/${id}`, getAuthHeader());
        } catch (error) {
            throw new Error('Error deleting order detail: ' + error.message);
        }
    }
};

export default orderService;
