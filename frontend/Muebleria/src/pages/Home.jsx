// src/pages/Home.jsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCarousel from "../components/ProductCarousel";
import AutoBanner, { bannerData } from "../components/AutoBanner";
import { getCategorias } from "../api";
import "./Home.css";
import { useInView } from 'react-intersection-observer'; 

export default function Home() {
    const [categorias, setCategorias] = useState([]);
    const [benefitsRef, benefitsInView] = useInView({ threshold: 0.1 });
    const [carouselRef, carouselInView] = useInView({ threshold: 0.1 });
    const [ctaRef, ctaInView] = useInView({ threshold: 0.1 });


    useEffect(() => {
        const cargarCategorias = async () => {
            try {
                
                const todasCategorias = [
                    { id: 5, categorias: 'Cocina' },
                    { id: 6, categorias: 'Baño' },
                ];
                
                const categoriasFiltradas = todasCategorias.filter(cat => 
                    cat.categorias && (
                        cat.categorias.toLowerCase().includes('cocina') || 
                        cat.categorias.toLowerCase().includes('baño')
                    )
                );
                
                setCategorias(categoriasFiltradas);
            } catch (error) {
                console.error("Error cargando categorías:", error);
            }
        };

        cargarCategorias();
    }, []);

    const categoriaCocina = categorias.find(cat => 
        cat.categorias && cat.categorias.toLowerCase().includes('cocina')
    );
    const categoriaBano = categorias.find(cat => 
        cat.categorias && cat.categorias.toLowerCase().includes('baño')
    );
    const getCategoryUrl = (categoryObj) => 
        categoryObj ? `/catalogo?categoria=${categoryObj.id}` : "/catalogo";


    return (
        <div className="home-page-wrapper">
            
            <AutoBanner banners={bannerData} autoPlayInterval={4000} />
            <section 
                className="grid home-section"
            >

                <div className="imgs">
                    <img
                        src="https://construmartcl.vtexassets.com/arquivos/ids/214515-800-auto?v=638602983701800000&width=800&height=auto&aspect=true"
                        className="imagen1"
                        alt="Cocina"
                    />
                </div>

                <div className="texto1">
                    <h2>Tu </h2> 
                    <h2>cocina</h2>
                    <p>
                        El café de la mañana, las cenas con amigos, los momentos que importan.
                        Diseñemos la cocina que será el corazón de tu hogar.
                    </p>
                    <Link 
                        to={getCategoryUrl(categoriaCocina)}
                        className="mi-boton"
                    >
                        <span className="nav-text">Ver más</span>
                        <span className="underline-right"></span>
                    </Link>
                </div>
            </section>
            
            <section 
                className="home-section benefits-section"
                ref={benefitsRef}
            >
                <h2 className="section-title">¿Por qué elegir SOMA?</h2>
                
                <div className="benefits-grid">
                    <div className={`benefit-card ${benefitsInView ? 'animate-in fadeInUp' : ''}`} style={{ transitionDelay: '0s' }}>
                        <i className="fa-solid fa-ruler-combined"></i>
                        <h4>Diseño Personalizado</h4>
                        <p>Muebles ajustados a tu estatura y ergonomía. Únicos como tú.</p>
                    </div>
                    <div className={`benefit-card ${benefitsInView ? 'animate-in fadeInUp' : ''}`} style={{ transitionDelay: '0.2s' }}>
                        <i className="fa-solid fa-tree"></i>
                        <h4>Materiales Sostenibles</h4>
                        <p>Madera certificada y procesos amigables con el medio ambiente.</p>
                    </div>
                    <div className={`benefit-card ${benefitsInView ? 'animate-in fadeInUp' : ''}`} style={{ transitionDelay: '0.4s' }}>
                        <i className="fa-solid fa-truck-fast"></i>
                        <h4>Despacho Rápido</h4>
                        <p>Entregamos tu mueble a medida en tiempo récord. Cobertura nacional.</p>
                    </div>
                    <div className={`benefit-card ${benefitsInView ? 'animate-in fadeInUp' : ''}`} style={{ transitionDelay: '0.6s' }}>
                        <i className="fa-solid fa-medal"></i>
                        <h4>Garantía Extendida</h4>
                        <p>Confiamos en la durabilidad de nuestros productos, por eso ofrecemos 5 años de garantía.</p>
                    </div>
                </div>
            </section>
            
            <section 
                className="carousel home-section"
                ref={carouselRef}
            >
                <h2 className="section-title">Productos Destacados</h2>
                <div className={`carousel-content-wrapper ${carouselInView ? 'animate-in fadeInUp' : ''}`}>
                    <ProductCarousel />
                </div>
            </section>

            <section 
                className="grid home-section reversed-grid">

                <div className="texto2">
                    <h2>Tu </h2> 
                    <h2>baño</h2>
                    <p>
                        Transfoma tu baño en un santuario de diseño. Materiales resistentes a la humedad y estilo minimalista.
                    </p>
                    <Link 
                        to={getCategoryUrl(categoriaBano)}
                        className="mi-boton"
                    >
                        <span className="nav-text">Ver más</span>
                        <span className="underline-right"></span>
                    </Link>
                </div>
                
                <div className="imgs">
                    <img
                        src="https://tse4.mm.bing.net/th/id/OIP.ephV2nlwzvQvYHU9NySHJQHaIJ?w=1746&h=1920&rs=1&pid=ImgDetMain&o=7&rm=3"
                        className="imagen1"
                        alt="Baño"
                    />
                </div>
            </section>
            
            <section 
                className="home-section final-cta-section"
                ref={ctaRef}
            >
                <div className={`cta-content-box ${ctaInView ? 'animate-in fadeInUp' : ''}`}>
                    <h2>¡Diseña tu Espacio SOMA Hoy!</h2>
                    <p>Ingresa tu estatura y déjanos crear la pieza perfecta que se adapta a tu vida.</p>
                    <Link to="/estatura" className="cta-button-large">
                        Comenzar Experiencia Personalizada →
                    </Link>
                </div>
            </section>

        </div>
    );
}