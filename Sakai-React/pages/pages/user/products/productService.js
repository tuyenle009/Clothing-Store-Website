import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const productService = {
    // Lấy tất cả danh mục
    getAllCategories: async () => {
        try {
            const response = await axios.get(`${API_URL}/categories`);
            return response.data;
        } catch (error) {
            throw new Error('Error fetching categories: ' + error.message);
        }
    },

    // Lấy sản phẩm (có thể lọc theo category_id)
    getProducts: async (categoryId = null) => {
        try {
            let url = `${API_URL}/products`;
            if (categoryId) {
                url += `?category_id=${categoryId}`;
            }
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            throw new Error('Error fetching products: ' + error.message);
        }
    },

    // Hàm sắp xếp sản phẩm
    sortProducts: (products, sortOption) => {
        const sortedProducts = [...products];
        
        switch (sortOption) {
            case 'low-to-high':
                return sortedProducts.sort((a, b) => a.price - b.price);
            case 'high-to-low':
                return sortedProducts.sort((a, b) => b.price - a.price);
            case 'newest':
                return sortedProducts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            default:
                return sortedProducts;
        }
    },

    // Hàm phân trang sản phẩm
    paginateProducts: (products, currentPage, itemsPerPage) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return {
            paginatedProducts: products.slice(startIndex, endIndex),
            totalPages: Math.ceil(products.length / itemsPerPage)
        };
    },

    // Mapping categories với subcategories
    mapCategories: (dbCategories) => {
        const mainCategories = {
            "NEW PRODUCTS": ["Dress", "Women's Blazer", "Skirt", "Women's Pants", "Women's Top", "T-shirt", "Vietnamese Traditional Dress", "Trench Coat"],
            "SALE 70%": ["Dress", "Women's Blazer", "Skirt", "Women's Pants", "Women's Top", "T-shirt", "Vietnamese Traditional Dress"]
        };

        // Map category names với category_id từ database
        const categoryMapping = {};
        dbCategories.forEach(cat => {
            categoryMapping[cat.category_name] = cat.category_id;
        });

        return [
            {
                id: "new-products",
                name: "NEW PRODUCTS",
                link: "#",
                subcategories: mainCategories["NEW PRODUCTS"].map(name => ({
                    name,
                    id: categoryMapping[name]
                }))
            },
            {
                id: "sale-products",
                name: "SALE 70%",
                link: "#",
                subcategories: mainCategories["SALE 70%"].map(name => ({
                    name,
                    id: categoryMapping[name]
                }))
            },
            { id: "perfume-products", name: "PERFUME", link: "#" },
            { id: "bag-products", name: "HANDBAGS", link: "#" },
            { id: "accessory-products", name: "ACCESSORIES", link: "#" }
        ];
    }
};

export default productService;