import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProductosDestacados } from '../api'; 
import './ProductCarousel.css';

const ProductCarousel = () => {
const [products, setProducts] = useState([]);
const [currentIndex, setCurrentIndex] = useState(0);

useEffect(() => {
getProductosDestacados()
    .then(data => {
    setProducts(data);
    })
    .catch(error => {
    console.error('Error al cargar productos destacados:', error);
    });
}, []);



return (
<div className="product-carousel-container">
    <div className="product-carousel">
    <div
        className="product-carousel-inner"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
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
            
            {/* DESCRIPCIÓN - AHORA SÍ FUNCIONARÁ */}
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

    
</div>
);
};

export default ProductCarousel;