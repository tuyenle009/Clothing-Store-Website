import { API_ENDPOINTS, createAxiosInstance } from '../../../../config/api';

const CACHE_KEYS = {
    USER_ORDERS: 'user_orders_',
    ORDER_DETAILS: 'order_details_',
    LAST_FETCH: 'last_fetch_'
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

// Helper function to ensure date strings are properly formatted
const formatDateString = (dateStr) => {
    if (!dateStr) return null;
    try {
        const date = new Date(dateStr);
        // Check if date is valid
        if (isNaN(date.getTime())) {
            return null;
        }
        return date.toISOString();
    } catch (error) {
        console.warn('Error formatting date:', error);
        return null;
    }
};

export const PurchaseOrderService = {
    // Check if cache is valid for a specific user
    isCacheValid(userId) {
        const lastFetch = localStorage.getItem(`${CACHE_KEYS.LAST_FETCH}${userId}`);
        if (!lastFetch) return false;
        
        const now = new Date().getTime();
        return (now - parseInt(lastFetch)) < CACHE_DURATION;
    },

    // Save data to cache with user-specific key
    saveToCache(key, data, userId = null) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            if (userId) {
                localStorage.setItem(`${CACHE_KEYS.LAST_FETCH}${userId}`, new Date().getTime().toString());
            }
        } catch (error) {
            console.warn('Error saving to cache:', error);
        }
    },

    // Get data from cache
    getFromCache(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.warn('Error reading from cache:', error);
            return null;
        }
    },

    // Clear user-specific cache
    clearUserCache(userId) {
        try {
            localStorage.removeItem(`${CACHE_KEYS.USER_ORDERS}${userId}`);
            localStorage.removeItem(`${CACHE_KEYS.LAST_FETCH}${userId}`);
        } catch (error) {
            console.warn('Error clearing cache:', error);
        }
    },

    // Get user's orders with full details
    async getUserOrders(userId) {
        try {
            // Check cache first
            if (this.isCacheValid(userId)) {
                const cachedOrders = this.getFromCache(`${CACHE_KEYS.USER_ORDERS}${userId}`);
                if (cachedOrders) {
                    return cachedOrders;
                }
            }

            const axiosInstance = createAxiosInstance();
            // Get orders for specific user
            const ordersResponse = await axiosInstance.get(`${API_ENDPOINTS.ORDERS}/user/${userId}`);

            // Get full details for each order
            const ordersWithDetails = await Promise.all(
                ordersResponse.data.map(async (order) => {
                    try {
                        // Get order details (products) for specific order
                        const detailsResponse = await axiosInstance.get(`${API_ENDPOINTS.ORDER_DETAILS}/order/${order.order_id}`);
                        
                        // Get payment info for specific order
                        const paymentResponse = await axiosInstance.get(`${API_ENDPOINTS.PAYMENTS}`, {
                            params: {
                                order_id: order.order_id,
                                is_deleted: false
                            }
                        });

                        // Calculate unique items count instead of total quantity
                        const itemsCount = detailsResponse.data.length; // This counts the number of different products

                        // Format dates before returning
                        return {
                            ...order,
                            created_at: formatDateString(order.created_at),
                            updated_at: formatDateString(order.updated_at),
                            items_count: itemsCount,
                            payment: paymentResponse.data[0] ? {
                                ...paymentResponse.data[0],
                                created_at: formatDateString(paymentResponse.data[0].created_at),
                                updated_at: formatDateString(paymentResponse.data[0].updated_at)
                            } : null,
                            details: detailsResponse.data
                        };
                    } catch (error) {
                        console.error(`Error fetching details for order ${order.order_id}:`, error);
                        return {
                            ...order,
                            created_at: formatDateString(order.created_at),
                            updated_at: formatDateString(order.updated_at),
                            items_count: 0,
                            payment: null,
                            details: []
                        };
                    }
                })
            );

            // Cache orders for this specific user
            this.saveToCache(`${CACHE_KEYS.USER_ORDERS}${userId}`, ordersWithDetails, userId);

            return ordersWithDetails;
        } catch (error) {
            console.error('Error fetching user orders:', error);
            // If API fails, try to get from cache even if expired
            const cachedOrders = this.getFromCache(`${CACHE_KEYS.USER_ORDERS}${userId}`);
            if (cachedOrders) {
                return cachedOrders;
            }
            throw error;
        }
    },

    // Get detailed order information
    async getOrderDetails(orderId) {
        try {
            const axiosInstance = createAxiosInstance();
            const detailsResponse = await axiosInstance.get(`${API_ENDPOINTS.ORDER_DETAILS}/order/${orderId}`);

            return detailsResponse.data.map(detail => ({
                ...detail,
                subtotal: detail.price * detail.quantity,
                image_url: detail.image_url || '/users/img/product-placeholder.png'
            }));
        } catch (error) {
            console.error('Error fetching order details:', error);
            throw error;
        }
    },

    // Get order payment information
    async getOrderPayment(orderId) {
        try {
            // Check cache first
            const cachedOrder = this.getFromCache(`${CACHE_KEYS.USER_ORDERS}${orderId}`);
            if (cachedOrder && this.isCacheValid() && cachedOrder.payment) {
                return cachedOrder.payment;
            }

            const axiosInstance = createAxiosInstance();
            const response = await axiosInstance.get(`${API_ENDPOINTS.PAYMENTS}/order/${orderId}`);

            if (response.data && response.data.length > 0) {
                const payment = response.data[0];
                const formattedPayment = {
                    ...payment,
                    created_at: formatDateString(payment.created_at),
                    payment_date: formatDateString(payment.created_at),
                    status: payment.payment_status,
                    formatted_method: payment.payment_method === 'COD' ? 'Cash On Delivery' : payment.payment_method,
                    amount: payment.amount || 0
                };

                // Update cache with payment info
                if (cachedOrder) {
                    cachedOrder.payment = formattedPayment;
                    this.saveToCache(`${CACHE_KEYS.USER_ORDERS}${orderId}`, cachedOrder);
                }

                return formattedPayment;
            }
            return null;
        } catch (error) {
            console.error('Error fetching order payment:', error);
            // If API fails, try to get from cache even if expired
            const cachedOrder = this.getFromCache(`${CACHE_KEYS.USER_ORDERS}${orderId}`);
            if (cachedOrder && cachedOrder.payment) {
                return cachedOrder.payment;
            }
            throw error;
        }
    },

    // Lấy thông tin chi tiết sản phẩm
    async getProductDetail(detailId) {
        try {
            const axiosInstance = createAxiosInstance();
            const response = await axiosInstance.get(`${API_ENDPOINTS.PRODUCT_DETAILS}/${detailId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching product detail:', error);
            throw error;
        }
    },

    // Lấy thông tin sản phẩm
    async getProduct(productId) {
        try {
            const axiosInstance = createAxiosInstance();
            const response = await axiosInstance.get(`${API_ENDPOINTS.PRODUCTS}/${productId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    },

    // Cancel an order
    async cancelOrder(orderId) {
        try {
            const axiosInstance = createAxiosInstance();
            const response = await axiosInstance.put(`${API_ENDPOINTS.ORDERS}/${orderId}`, {
                order_status: 'canceled'
            });
            return response.data;
        } catch (error) {
            console.error('Error canceling order:', error);
            throw error;
        }
    },

    // Force refresh user's orders
    async refreshOrders(userId) {
        this.clearUserCache(userId);
        return this.getUserOrders(userId);
    }
};
