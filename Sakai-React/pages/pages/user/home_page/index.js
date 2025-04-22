import React, { useState, useEffect } from "react";
import Link from 'next/link';

const HomePage = () => {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const banners = [
    "/users/img/banner1.jpeg",
    "/users/img/banner2.jpeg",
    "/users/img/banner3.jpeg",
    "/users/img/banner4.jpeg",
    "/users/img/banner5.jpeg"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handlePrevious = () => {
    setCurrentBannerIndex((prevIndex) => 
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  return (
    <main className="homepage-container">
      {/* Banner */}
      <div id="bannerHome">
        <button className="homepage-nav-button" id="prevButton" onClick={handlePrevious}>❮</button>
        <img 
          id="bannerImage" 
          src={banners[currentBannerIndex]} 
          alt={`Banner ${currentBannerIndex + 1}`} 
        />
        <button className="homepage-nav-button" id="nextButton" onClick={handleNext}>❯</button>
      </div>

      <div id="content">
        {/* New Arrivals */}
        <section id="new-arrival">
          <h2>NEW ARRIVAL</h2>
          <div className="homepage-products">
            {[
              { img: "/users/img/product-demo1.png"},
              { img: "/users/img/product-demo2.png"},
              { img: "/users/img/product-demo3.png"},
              { img: "/users/img/product-demo4.png"}
            ].map((product, index) => (
              <div className="homepage-product" key={index}>
                <img src={product.img} alt={`Product ${index + 1}`} />
                <p className="price">{product.price}</p>
                <p className="homepage-description">{product.desc}</p>
              </div>
            ))}
          </div>

          {/* Nút Read More */}
          <Link href="/pages/user/products" className="load-more">
            READ MORE
          </Link>
        </section>

        {/* Instagram Gallery */}
        <section id="instagram">
          <h2>INSTAGRAM</h2>
          <p>@sixdo.vn</p>
          <div id="instagram-gallery">
            {Array.from({ length: 9 }, (_, i) => (
              <img
                key={i}
                src={`/users/img/insta${i + 1}.jpeg`}
                alt={`Instagram Photo ${i + 1}`}
                className="sub-insta"
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default HomePage;
