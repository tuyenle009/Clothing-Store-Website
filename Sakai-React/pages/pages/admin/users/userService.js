import { createAxiosInstance, API_ENDPOINTS } from '../../../../config/api';

// Tạo instance axios với các headers chuẩn và interceptors
const axiosInstance = createAxiosInstance();

const userService = {
    getAllUsers: async () => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.USERS);
            return response.data;
        } catch (error) {
            throw new Error('Error fetching data: ' + error.message);
        }
    },

    getUserById: async (id) => {
        try {
            const response = await axiosInstance.get(`${API_ENDPOINTS.USERS}/${id}`);
            return response.data;
        } catch (error) {
            throw new Error('Error fetching record by ID: ' + error.message);
        }
    },

    addUser: async (userData) => {
        try {
            const { id, ...dataWithoutId } = userData;
            const response = await axiosInstance.post(API_ENDPOINTS.USERS, dataWithoutId);
            return response.data;
        } catch (error) {
            throw new Error('Error adding record: ' +error.message);
        }
    },

    updateUser: async (userData) => {
        try {
            const response = await axiosInstance.put(`${API_ENDPOINTS.USERS}/${userData.user_id}`, userData);
            return response.data;
        } catch (error) {
            throw new Error('Error updating record: ' + error.message);
        }
    },

    deleteUser: async (id) => {
        try {
            await axiosInstance.delete(`${API_ENDPOINTS.USERS}/${id}`);
        } catch (error) {
            throw new Error('Error deleting record: ' + error.message);
        }
    },

    changePassword: async (userId, newPassword) => {
        try {
            const response = await axiosInstance.put(`${API_ENDPOINTS.USERS}/${userId}/change-password`, { newPassword });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error changing password: ' + error.message);
        }
    }
};

export default userService;