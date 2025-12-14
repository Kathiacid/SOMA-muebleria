import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getProductosDestacados } from '../api'; 
import './ProductCarousel.css';

const ProductCarousel = () => {
    const [products, setProducts] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const trackRef = useRef(null);

    useEffect(() => {
        getProductosDestacados()
            .then(data => {
                setProducts(data);
            })
            .catch(error => {
                console.error('Error al cargar productos destacados:', error);
            });
    }, []);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width <= 600) {
                setItemsPerPage(1);
            } else if (width <= 1024) {
                setItemsPerPage(3);
            } else {
                setItemsPerPage(5);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const isCentered = products.length > 0 && products.length <= itemsPerPage;


    const getTranslateX = () => {
        if (isCentered) return 0; 
        if (!trackRef.current) return 0;
        const firstCard = trackRef.current.children[0];
        if (!firstCard) return 0;

        const itemWidth = firstCard.getBoundingClientRect().width;
        const gap = parseFloat(window.getComputedStyle(trackRef.current).gap) || 0;
        return -(itemWidth + gap) * currentIndex;
    };


    const handleNext = () => {
        if (currentIndex < products.length - itemsPerPage) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    return (
        <div className="product-carousel-container">
            <div className="product-carousel">
                <div
                    ref={trackRef}
                    className={`product-carousel-inner ${isCentered ? 'center-content' : ''}`}
                    style={{ transform: `translateX(${getTranslateX()}px)` }}
                >
                    {products.map(product => (
                        <div key={product.id} className="product-card">
                            <div className="product-image-container">
                                <img
                                    src={product.producto_imagen}
                                    alt={product.producto_nombre}
                                    className="product-image"
                                />
                            </div>
                            <div className="product-info">
                                <h3 className="product-name">
                                    <Link to={`/producto/${product.producto}`}>
                                        {product.producto_nombre}
                                    </Link>
                                </h3>
                                
                                <p className="product-description">
                                    {product.producto_descripcion || "Descripción no disponible"}
                                </p>
                                
                                <p className="product-price">
                                    ${parseFloat(product.producto_precio).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {!isCentered && products.length > 0 && (
                <div className="carousel-controls">
                    <button 
                        className="control-btn" 
                        onClick={handlePrev} 
                        disabled={currentIndex === 0}
                        aria-label="Anterior"
                    >
                        &#8592;
                    </button>
                    <button 
                        className="control-btn" 
                        onClick={handleNext} 
                        disabled={currentIndex >= products.length - itemsPerPage}
                        aria-label="Siguiente"
                    >
                        &#8594;
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductCarousel;