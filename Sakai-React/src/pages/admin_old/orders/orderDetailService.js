// Lấy danh sách sản phẩm (không bao gồm chi tiết)
export const getAllProducts = () => {
    return axios.get(`${API_URL}/products`)
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching products:', error);
            throw error;
        });
};

// Lấy danh sách màu sắc của một sản phẩm
export const getProductColors = (productId) => {
    return axios.get(`${API_URL}/product_details/colors/${productId}`)
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching colors:', error);
            throw error;
        });
};

// Lấy danh sách kích thước của một sản phẩm theo màu
export const getProductSizes = (productId, color) => {
    return axios.get(`${API_URL}/product_details/sizes/${productId}/${encodeURIComponent(color)}`)
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching sizes:', error);
            throw error;
        });
};

// Lấy detail_id và stock_quantity dựa trên product_id, color và size
export const getDetailId = (productId, color, size) => {
    return axios.get(`${API_URL}/product_details/detail/${productId}/${encodeURIComponent(color)}/${encodeURIComponent(size)}`)
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching detail_id:', error);
            throw error;
        });
}; 