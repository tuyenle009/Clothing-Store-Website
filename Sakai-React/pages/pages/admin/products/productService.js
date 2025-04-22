import axios from 'axios';
const API_URL = 'http://localhost:5000/products';
const CATEGORY_API_URL = 'http://localhost:5000/categories';
const PRODUCT_DETAILS_API_URL = 'http://localhost:5000/product_details';

const productService = {
    getAllProducts: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            throw new Error('Error fetching products: ' + error.message);
        }
    },

    getAllCategories: async () => {
        try {
            const response = await axios.get(CATEGORY_API_URL);
            return response.data;
        } catch (error) {
            throw new Error('Error fetching categories: ' + error.message);
        }
    },

    getProductById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            throw new Error('Error fetching product by ID: ' + error.message);
        }
    },

    getProductDetailsByProductId: async (productId) => {
        try {
            const response = await axios.get(`${PRODUCT_DETAILS_API_URL}/product/${productId}`);
            return response.data;
        } catch (error) {
            throw new Error('Error fetching product details: ' + error.message);
        }
    },

    addProduct: async (productData) => {
        try {
            const { product_id, ...dataWithoutId } = productData;
            const response = await axios.post(API_URL, dataWithoutId);
            return response.data;
        } catch (error) {
            throw new Error('Error adding product: ' + error.message);
        }
    },

    updateProduct: async (productData) => {
        try {
            const response = await axios.put(`${API_URL}/${productData.product_id}`, productData);
            return response.data;
        } catch (error) {
            throw new Error('Error updating product: ' + error.message);
        }
    },

    deleteProduct: async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
        } catch (error) {
            throw new Error('Error deleting product: ' + error.message);
        }
    }
};

export default productService;
