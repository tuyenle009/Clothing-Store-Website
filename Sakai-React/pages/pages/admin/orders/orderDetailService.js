import axios from 'axios';
const API_URL = 'http://localhost:5000/order_details';
const PRODUCT_DETAILS_API_URL = 'http://localhost:5000/product_details';
const PRODUCTS_API_URL = 'http://localhost:5000/products';

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

const orderDetailService = {
    getAllOrderDetails: async () => {
        try {
            const response = await axios.get(API_URL, getAuthHeader());
            return response.data;
        } catch (error) {
            throw new Error('Error fetching order details: ' + error.message);
        }
    },

    getAllProductDetails: async () => {
        try {
            const response = await axios.get(PRODUCT_DETAILS_API_URL, getAuthHeader());
            // Lọc ra các sản phẩm chưa bị xóa
            const activeProducts = response.data.filter(product => !product.is_deleted);
            return activeProducts;
        } catch (error) {
            throw new Error('Error fetching product details: ' + error.message);
        }
    },

    getOrderDetailById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`, getAuthHeader());
            return response.data;
        } catch (error) {
            throw new Error('Error fetching order detail by ID: ' + error.message);
        }
    },

    getOrderDetailsByOrderId: async (orderId) => {
        try {
            const response = await axios.get(`${API_URL}/order/${orderId}`, getAuthHeader());
            return response.data;
        } catch (error) {
            throw new Error('Error fetching order details by order ID: ' + error.message);
        }
    },

    addOrderDetail: async (orderDetail) => {
        try {
            const response = await axios.post(API_URL, orderDetail, getAuthHeader());
            return response.data;
        } catch (error) {
            throw new Error('Error adding order detail: ' + error.message);
        }
    },

    updateOrderDetail: async (orderDetail) => {
        try {
            const response = await axios.put(`${API_URL}/${orderDetail.order_detail_id}`, orderDetail, getAuthHeader());
            return response.data;
        } catch (error) {
            throw new Error('Error updating order detail: ' + error.message);
        }
    },

    deleteOrderDetail: async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`, getAuthHeader());
        } catch (error) {
            throw new Error('Error deleting order detail: ' + error.message);
        }
    },

    getAllProducts: async () => {
        try {
            const response = await axios.get(PRODUCTS_API_URL, getAuthHeader());
            // Lọc ra các sản phẩm chưa bị xóa
            const activeProducts = response.data.filter(product => !product.is_deleted);
            return activeProducts;
        } catch (error) {
            throw new Error('Error fetching products: ' + error.message);
        }
    },

    getProductColors: async (productId) => {
        try {
            const response = await axios.get(`${PRODUCT_DETAILS_API_URL}/colors/${productId}`, getAuthHeader());
            return response.data;
        } catch (error) {
            throw new Error('Error fetching product colors: ' + error.message);
        }
    },

    getProductSizes: async (productId, color) => {
        try {
            const response = await axios.get(`${PRODUCT_DETAILS_API_URL}/sizes/${productId}/${color}`, getAuthHeader());
            return response.data;
        } catch (error) {
            throw new Error('Error fetching product sizes: ' + error.message);
        }
    },

    getDetailId: async (productId, color, size) => {
        try {
            const response = await axios.get(`${PRODUCT_DETAILS_API_URL}/detail/${productId}/${color}/${size}`, getAuthHeader());
            return response.data;
        } catch (error) {
            throw new Error('Error fetching detail id: ' + error.message);
        }
    }
};

export default orderDetailService; 