import React, { useState, useEffect } from "react";
import "./AutoBanner.css";

export const bannerData = [
  {
    image: "https://cl-paris-media-hub.ecomm.cencosud.com/files/top_categorias/muebles/banner_top_muebles_26jun25_desk.jpg?v=1",
  },
  {
    image: "https://cdn.venngage.com/template/thumbnail/full/11420daa-f4b8-4ac3-bf74-dd87f2a955e9.webp",
  },
  {
    image: "https://img.freepik.com/vector-gratis/mega-banner-venta-o-cartel-publicitario-muebles-hogar_33099-801.jpg",
  },
];

const AutoBanner = ({ banners, autoPlayInterval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextBanner = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === banners.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevBanner = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    );
  };

  const goToBanner = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextBanner();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlayInterval, banners.length]);

  return (
    <div className="banner-main-container"> 
      <div className="auto-banner">
        <div
          className="banner-container"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {banners.map((banner, index) => (
            <div
              key={index}
              className="banner-slide"
              style={{ backgroundImage: `url(${banner.image})` }}
            >
              
            </div>
          ))}
        </div>

        <button className="nav-button prev-button" onClick={prevBanner}>
          &#10094;
        </button>

        <button className="nav-button next-button" onClick={nextBanner}>
          &#10095;
        </button>
      </div>
    </div>
  );
};

export default AutoBanner;