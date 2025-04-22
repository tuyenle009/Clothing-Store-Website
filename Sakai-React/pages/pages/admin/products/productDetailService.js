import axios from 'axios';

const API_URL = 'http://localhost:5000/product_details';

const productDetailService = {
    getAllProductDetails: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            throw new Error('Error fetching product details: ' + error.message);
        }
    },

    getProductDetailsByProductId: async (productId) => {
        try {
            const response = await axios.get(`${API_URL}/product/${productId}`);
            return response.data;
        } catch (error) {
            throw new Error('Error fetching product details by product ID: ' + error.message);
        }
    },

    getProductDetailById: async (detailId) => {
        try {
            const response = await axios.get(`${API_URL}/${detailId}`);
            return response.data;
        } catch (error) {
            throw new Error('Error fetching product detail by ID: ' + error.message);
        }
    },

    addProductDetail: async (productDetailData) => {
        try {
            const dataToSend = {
                ...productDetailData,
                is_deleted: 0
            };
            const response = await axios.post(API_URL, dataToSend);
            return response.data;
        } catch (error) {
            throw new Error('Error adding product detail: ' + error.message);
        }
    },

    updateProductDetail: async (detailId, productDetailData) => {
        try {
            const response = await axios.put(`${API_URL}/${detailId}`, productDetailData);
            return response.data;
        } catch (error) {
            throw new Error('Error updating product detail: ' + error.message);
        }
    },

    deleteProductDetail: async (detailId) => {
        try {
            const response = await axios.delete(`${API_URL}/${detailId}`);
            return response.data;
        } catch (error) {
            throw new Error('Error deleting product detail: ' + error.message);
        }
    }
};

export default productDetailService; 