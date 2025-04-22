import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import { CartService } from "../shopping_basket/cartService";

const ProductDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [productDetails, setProductDetails] = useState([]);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      fetchProductDetail();
      fetchProductDetails();
    }
  }, [id]);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/products/${id}`);
      if (response.data && response.data.length > 0) {
        setProduct(response.data[0]);
      } else {
        setError('Product not found');
      }
    } catch (err) {
      setError('Error fetching product details: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/product_details/product/${id}`);
      if (response.data) {
        const activeDetails = response.data.filter(detail => !detail.is_deleted);
        setProductDetails(activeDetails);

        if (activeDetails.length > 0) {
          const firstColor = activeDetails[0].color;
          setSelectedColor(firstColor);

          const firstDetail = activeDetails.find(detail => detail.color === firstColor);
          if (firstDetail) {
            setSelectedDetail(firstDetail);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching product details:', err);
    }
  };

  const uniqueColors = [...new Set(productDetails.map(detail => detail.color))];

  const availableSizes = productDetails
    .filter(detail => detail.color === selectedColor)
    .map(detail => ({
      size: detail.size,
      detail_id: detail.detail_id,
      stock_quantity: detail.stock_quantity
    }));

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setSelectedDetail(null);
  };

  const handleSizeSelect = (detail) => {
    setSelectedDetail(detail);
  };

  const handleAddToCart = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData) {
        router.push('/auth/login');
        return;
      }

      if (!selectedColor || !selectedDetail) {
        return;
      }

      if (quantity < 1 || quantity > selectedDetail.stock_quantity) {
        return;
      }

      console.log('Adding to cart:', {
        user_id: userData.user_id,
        product_id: product.product_id,
        detail_id: selectedDetail.detail_id,
        quantity: quantity
      });

      const response = await axios.post('http://localhost:5000/cart', {
        user_id: userData.user_id,
        product_id: product.product_id,
        detail_id: selectedDetail.detail_id,
        quantity: quantity
      });

      if (response.data) {
        const cartCount = await CartService.getCartCount(userData.user_id);
        window.dispatchEvent(new CustomEvent('cartUpdated', { 
          detail: { count: cartCount }
        }));
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <main id="productdetail-main">
      <nav id="productdetail-breadcrumb">
        <Link href="/" style={{ color: '#888', textDecoration: 'none' }}>HOMEPAGE</Link> / 
        <Link href="/pages/user/products" style={{ color: '#888', textDecoration: 'none' }}>NEW PRODUCT</Link> / 
        <span>{product.product_name}</span>
      </nav>
      <div id="productdetail-page">
        <div id="productdetail-gallery">
          <img 
            id="productdetail-main-image" 
            src={selectedDetail?.image_url || product.image_url || "/users/img/image_not_found.png"} 
            alt={product.product_name} 
          />
        </div>
        <div id="productdetail-details">
          <h1 className="productdetail-name">{product.product_name}</h1>
          <p className="productdetail-ID">MSP: {product.product_id}</p>
          <p className="productdetail-price">
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }).format(product.price)}
          </p>

          <div className="productdetail-colors">
            <p>COLOR: {selectedColor || ''}</p>
            <div className="color-options">
              {uniqueColors.map((color) => (
                <button
                  key={color}
                  className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                  onClick={() => handleColorSelect(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {selectedColor && (
            <div className="productdetail-sizes">
              <p>SIZE: {selectedDetail?.size || ''}</p>
              <div className="size-options">
                {availableSizes.map((sizeOption) => (
                  <button
                    key={sizeOption.detail_id}
                    className={`size-option ${selectedDetail?.detail_id === sizeOption.detail_id ? 'selected' : ''}`}
                    onClick={() => handleSizeSelect(productDetails.find(d => d.detail_id === sizeOption.detail_id))}
                    disabled={sizeOption.stock_quantity <= 0}
                  >
                    {sizeOption.size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="productdetail-quantity">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={!selectedDetail}
            >
              -
            </button>
            <input 
              type="number" 
              value={quantity} 
              min="1" 
              max={selectedDetail?.stock_quantity || 1}
              readOnly 
            />
            <button 
              onClick={() => setQuantity(Math.min(selectedDetail?.stock_quantity || 1, quantity + 1))}
              disabled={!selectedDetail}
            >
              +
            </button>
          </div>

          <button 
            className="productdetail-add-to-cart"
            onClick={handleAddToCart}
            disabled={!selectedDetail || selectedDetail.stock_quantity < 1}
            style={{ marginBottom: '2rem' }}
          >
            {!selectedColor ? 'PLEASE SELECT COLOR' :
             !selectedDetail ? 'PLEASE SELECT SIZE' :
             selectedDetail.stock_quantity < 1 ? 'OUT OF STOCK' : 
             'ADD TO CART'}
          </button>

          <div className="productdetail-details-section">
            <h2>DETAILS</h2>
            <p>{product.description || 'No description available'}</p>
          </div>

          <div className="productdetail-size-note">
            <h3>⚠️ NOTES</h3>
            <p>- The size chart above is a general reference guide. Depending on body measurements, product form, and different fabric materials, there may be variations of 1-2cm or more.</p>
            <p>- Product colors may slightly differ from actual colors due to lighting effects, but quality is guaranteed.</p>
            <p>- SIXDO Online does not support product inspection before payment. Therefore, please record a video of the product opening process so SIXDO can assist you if there are any order issues.</p>
            <p>- SIXDO issues red invoices within 24 hours of successful order placement. Please contact HOTLINE during business hours: 1800 6650 for invoice support.</p>
          </div>

          <div className="productdetail-policies">
            <h3>❗️ RETURN POLICY</h3>
            <p>SIXDO does not support returns under any circumstances.</p>

            <h3>❗️ EXCHANGE POLICY</h3>
            <p>- SIXDO Offline Store System: Supports exchanges within 06 days from the date of purchase at the Showroom.</p>
            <p>- SIXDO Online Store System (Fanpage/Website): Supports exchanges within 15 days from the date the Online sale creates the order and issues the Bill.</p>
            <p>- Online customers please record a video of the product opening process so SIXDO can assist you if there are any order issues.</p>

            <h3>❗️ EXCHANGE CONDITIONS</h3>
            <p>- Original price items.</p>
            <p>- Items discounted less than 50%.</p>
            <p>- Original labels, barcodes, unused condition.</p>
            <p>- Must have purchase invoice. If no invoice, please contact Hotline 1800 6650 for support.</p>

            <p className="contact-note">Contact SIXDO directly for more information and order support. Hotline (business hours): 1800 6650</p>
          </div>

          <div className="productdetail-contact">
            <a href="#">📞 Hotline</a>
            <a href="#">🗨 Chat online</a>
            <a href="#">💻 Share</a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;
