import React, { useState, useEffect } from "react";
import Link from "next/link";
import productService from "./productService";

const ITEMS_PER_PAGE = 9;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOption, setSortOption] = useState('newest');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentCategoryName, setCurrentCategoryName] = useState('NEW PRODUCTS');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [currentPage, selectedCategory]);

  useEffect(() => {
    if (products.length > 0) {
      const sortedProducts = productService.sortProducts(products, sortOption);
      const { paginatedProducts, totalPages: newTotalPages } = productService.paginateProducts(
        sortedProducts,
        currentPage,
        ITEMS_PER_PAGE
      );
      setProducts(paginatedProducts);
      setTotalPages(newTotalPages);
    }
  }, [sortOption]);

  const fetchCategories = async () => {
    try {
      const dbCategories = await productService.getAllCategories();
      const mappedCategories = productService.mapCategories(dbCategories);
      setCategories(mappedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getProducts(selectedCategory);
      const sortedProducts = productService.sortProducts(response, sortOption);
      const { paginatedProducts, totalPages: newTotalPages } = productService.paginateProducts(
        sortedProducts,
        currentPage,
        ITEMS_PER_PAGE
      );
      setProducts(paginatedProducts);
      setTotalPages(newTotalPages);
    } catch (err) {
      setError('Error fetching products: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleCategoryClick = (categoryId, categoryName, subCategory) => {
    setCurrentPage(1);
    if (subCategory) {
      setSelectedCategory(subCategory.id);
      setCurrentCategoryName(subCategory.name);
    } else {
      setSelectedCategory(null);
      setCurrentCategoryName(categoryName);
    }
  };

  return (
    <div id="product-main">
      <div id="product-banner">
        <img src="/users/img/banner1.jpeg" alt="Banner" />
      </div>
      <div id="product-content">
        <div id="product-aside">
          <div id="category">
            <h3>CATEGORIES</h3>
            <ul>
              {categories.map((category) => (
                <div className="product-item-parent" key={category.id}>
                  <li id={category.id}>
                    <a 
                      href="#"
                      className="menu-link"
                      onClick={(e) => {
                        e.preventDefault();
                        if (category.subcategories) {
                          toggleCategory(category.id);
                        } else {
                          handleCategoryClick(category.id, category.name);
                        }
                      }}
                    >
                      {category.name}
                    </a>
                    {category.subcategories && (
                      <ul className={`dropdown-menu ${expandedCategories[category.id] ? 'expanded' : ''}`}>
                        {category.subcategories.map((sub) => (
                          <li 
                            key={sub.id}
                            onClick={() => handleCategoryClick(category.id, category.name, sub)}
                          >
                            {sub.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                  {category.subcategories && (
                    <div 
                      className={`toggle-icon ${expandedCategories[category.id] ? 'expanded' : ''}`}
                      onClick={() => toggleCategory(category.id)}
                    >
                      {expandedCategories[category.id] ? '-' : '+'}
                    </div>
                  )}
                </div>
              ))}
            </ul>
          </div>
        </div>

        <div id="product-section">
          <div className="section-header">
            <h3>{currentCategoryName}</h3>
            <div className="sort-dropdown">
              <select 
                value={sortOption}
                onChange={(e) => {
                  setSortOption(e.target.value);
                }}
              >
                <option value="newest">Newest</option>
                <option value="low-to-high">Price: Low to High</option>
                <option value="high-to-low">Price: High to Low</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="loading">Loading products...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            <>
              <div className="products">
                {products.map((product) => (
                  <div className="product" key={product.product_id}>
                    <Link 
                      href="/pages/user/product_detail/[id]"
                      as={`/pages/user/product_detail/${product.product_id}`}
                      style={{ textDecoration: 'none', color: 'black' }}
                    >
                      <img 
                        src={product.image_url || "/users/img/image_not_found.png"} 
                        alt={product.product_name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/users/img/image_not_found.png";
                        }}
                      />
                      <p className="price">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0
                        }).format(product.price)}
                      </p>
                      <p className="product-name">{product.product_name}</p>
                    </Link>
                  </div>
                ))}
              </div>
              
              {totalPages > 1 && (
                <div className="pagination">
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      className={currentPage === index + 1 ? 'active' : ''}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
