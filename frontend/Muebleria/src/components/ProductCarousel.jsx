import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getProductosDestacados } from '../api'; 
import './ProductCarousel.css';

const ProductCarousel = () => {
    const [products, setProducts] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const trackRef = useRef(null);

    // 1. Cargar datos
    useEffect(() => {
        getProductosDestacados()
            .then(data => {
                setProducts(data);
            })
            .catch(error => {
                console.error('Error al cargar productos destacados:', error);
            });
    }, []);

    // 2. Determinar cuántos items se ven según el tamaño de pantalla
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

        // Ejecutar al inicio y al redimensionar
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 3. Lógica de Centrado
    // Si hay menos productos que huecos disponibles, se centran y deshabilitamos navegación.
    const isCentered = products.length > 0 && products.length <= itemsPerPage;

    // 4. Calcular el desplazamiento (translateX)
    const getTranslateX = () => {
        if (isCentered) return 0; // Si está centrado, no se mueve
        if (!trackRef.current) return 0;

        // Obtenemos el ancho de la primera tarjeta
        const firstCard = trackRef.current.children[0];
        if (!firstCard) return 0;

        const itemWidth = firstCard.getBoundingClientRect().width;
        // Obtenemos el gap computado (20px o 15px)
        const gap = parseFloat(window.getComputedStyle(trackRef.current).gap) || 0;
        
        // Movimiento: (Ancho item + Gap) * Índice actual
        return -(itemWidth + gap) * currentIndex;
    };

    // 5. Handlers de botones
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

            {/* Controles: Solo se muestran si NO está centrado (hay más productos que huecos) */}
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