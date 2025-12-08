// src/pages/SobreNosotros.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './sobreNosotros.css';

const SobreNosotros = () => {
return (
<div className="sobre-nosotros-container">
    <div className="sobre-nosotros-card">
    <h1>Sobre Nosotros</h1>
    <p>
        Bienvenido a [Nombre de tu Tienda], tu destino ideal para muebles de madera hechos a medida. 
        Creemos que cada persona es única, y por eso, tus muebles también deberían serlo. 
        Nuestro objetivo es ofrecerte piezas que no solo sean hermosas y duraderas, sino que también 
        se adapten perfectamente a tus necesidades y, lo más importante, a tu estatura.
    </p>
    <p>
        Cada uno de nuestros productos es diseñado y fabricado con pasión, utilizando madera de alta calidad 
        para garantizar que cada pieza sea una inversión para toda la vida. Desde mesas y sillas hasta 
        estanterías y camas, nuestro catálogo está pensado para brindarte comodidad y estilo en cada rincón de tu hogar.
    </p>
    <div className="sobre-nosotros-links">
        <Link to="/" className="btn-enlace">Ir a Inicio</Link>
        <Link to="/catalogo" className="btn-enlace">Explorar Catálogo</Link>
    </div>
    </div>
</div>
);
};

export default SobreNosotros;