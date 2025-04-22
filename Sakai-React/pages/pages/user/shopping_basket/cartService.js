import { API_ENDPOINTS, createAxiosInstance } from '../../../../config/api';

export const CartService = {
    // Lấy thông tin giỏ hàng của user
    async getUserCart(userId) {
        try {
            const axiosInstance = createAxiosInstance();
            console.log('Fetching cart for userId:', userId);
            const response = await axiosInstance.get(`${API_ENDPOINTS.CART}?user_id=${userId}`);
            console.log('Cart API Response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching cart:', error);
            throw error;
        }
    },

    // Lấy thông tin chi tiết sản phẩm
    async getProductDetails(productId) {
        try {
            const axiosInstance = createAxiosInstance();
            const response = await axiosInstance.get(`${API_ENDPOINTS.PRODUCTS}/${productId}`);
            console.log('Product Details Response:', response.data); // Debug log
            return response.data;
        } catch (error) {
            console.error('Error fetching product details:', error);
            throw error;
        }
    },

    // Lấy số lượng sản phẩm trong giỏ hàng
    async getCartCount(userId) {
        try {
            const axiosInstance = createAxiosInstance();
            console.log('Fetching cart count for userId:', userId);
            
            // Lấy toàn bộ giỏ hàng
            const response = await axiosInstance.get(`${API_ENDPOINTS.CART}?user_id=${userId}`);
            console.log('Cart items for count:', response.data);
            
            if (!response.data || !Array.isArray(response.data)) {
                console.log('No cart items found, returning 0');
                return 0;
            }

            // Đếm số loại sản phẩm khác nhau (không quan tâm đến số lượng)
            const uniqueProductCount = new Set(response.data.map(item => item.product_id)).size;
            console.log('Calculated unique products count:', uniqueProductCount);
            
            return uniqueProductCount;
        } catch (error) {
            console.error('Error getting cart count:', error);
            return 0;
        }
    },

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    async updateCartItemQuantity(cartItemId, userId, productId, quantity) {
        try {
            const axiosInstance = createAxiosInstance();
            const response = await axiosInstance.put(`${API_ENDPOINTS.CART}/${cartItemId}`, {
                user_id: userId,
                product_id: productId,
                quantity: quantity
            });

            // Trigger sự kiện cập nhật giỏ hàng
            window.dispatchEvent(new CustomEvent('cartUpdated'));
            
            return response.data;
        } catch (error) {
            console.error('Error updating cart item:', error);
            throw error;
        }
    },

    // Xóa sản phẩm khỏi giỏ hàng
    async removeFromCart(cartItemId) {
        try {
            const axiosInstance = createAxiosInstance();
            const response = await axiosInstance.delete(`${API_ENDPOINTS.CART}/${cartItemId}`);
            
            // Trigger sự kiện cập nhật giỏ hàng
            window.dispatchEvent(new CustomEvent('cartUpdated'));
            
            return response.data;
        } catch (error) {
            console.error('Error removing item from cart:', error);
            throw error;
        }
    },

    // Xóa tất cả sản phẩm trong giỏ hàng của user
    async clearUserCart(userId) {
        try {
            const axiosInstance = createAxiosInstance();
            // Lấy tất cả cart items của user
            const cartItems = await this.getUserCart(userId);
            
            // Xóa từng item
            const deletePromises = cartItems.map(item => 
                this.removeFromCart(item.id)
            );
            
            await Promise.all(deletePromises);
            
            return true;
        } catch (error) {
            console.error('Error clearing user cart:', error);
            throw error;
        }
    }
}; 