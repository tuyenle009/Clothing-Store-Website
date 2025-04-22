import axios from 'axios';
const API_URL = 'http://localhost:5000/categories';

const categoryService = {
    getAllCategories: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            throw new Error('Error fetching categories: ' + error.message);
        }
    },

    getCategoryById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            throw new Error('Error fetching category by ID: ' + error.message);
        }
    },

    addCategory: async (categoryData) => {
        try {
            const { category_id, ...dataWithoutId } = categoryData;
            const response = await axios.post(API_URL, dataWithoutId);
            return response.data;
        } catch (error) {
            throw new Error('Error adding category: ' + error.message);
        }
    },

    updateCategory: async (categoryData) => {
        try {
            const response = await axios.put(`${API_URL}/${categoryData.category_id}`, categoryData);
            return response.data;
        } catch (error) {
            throw new Error('Error updating category: ' + error.message);
        }
    },

    deleteCategory: async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
        } catch (error) {
            throw new Error('Error deleting category: ' + error.message);
        }
    }
};

export default categoryService;
