import axios from 'axios';
const API_URL = 'http://localhost:5000/payments';

const paymentService = {
    getAllPayments: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            throw new Error('Error fetching payments: ' + error.message);
        }
    },

    getPaymentById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            throw new Error('Error fetching payment by ID: ' + error.message);
        }
    },

    addPayment: async (paymentData) => {
        try {
            const { payment_id, ...dataWithoutId } = paymentData;
            const response = await axios.post(API_URL, dataWithoutId);
            return response.data;
        } catch (error) {
            throw new Error('Error adding payment: ' + error.message);
        }
    },

    updatePayment: async (paymentData) => {
        try {
            const response = await axios.put(`${API_URL}/${paymentData.payment_id}`, paymentData);
            return response.data;
        } catch (error) {
            throw new Error('Error updating payment: ' + error.message);
        }
    },

    deletePayment: async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
        } catch (error) {
            throw new Error('Error deleting payment: ' + error.message);
        }
    }
};

export default paymentService;
