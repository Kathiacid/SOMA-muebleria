import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCarousel from "../components/ProductCarousel";
import "./Home.css";
import { useInView } from 'react-intersection-observer';

export default function Home() {
    const [heroRef, heroInView] = useInView({ threshold: 0.1 });
    const [catRef, catInView] = useInView({ threshold: 0.1 });
    const [carouselRef, carouselInView] = useInView({ threshold: 0.1 });
    const [journalRef, journalInView] = useInView({ threshold: 0.1 });
    const espaciosCurados = [
        {
            title: "Living & Comedor",
            img: "https://nowuhogar.com/cdn/shop/products/IMG_20220521_104844_759_1200x.jpg?v=1676555953",
            path: "/catalogo?categoria=4"
        },
        {
            title: "Cocina",
            img: "https://content.elmueble.com/medio/2021/03/07/cocina-con-puertas-de-madera-en-muebles-00508440_14542747_1605x2000.jpg",
            path: "/catalogo?categoria=1"
        },
        {
            title: "Exterior",
            img: "https://alexamatuhogar.cl/wp-content/uploads/sites/5/2022/01/alex-Discover-how-to-polish-your-garden-furniture.jpg",
            path: "/catalogo?categoria=3"
        },
        {
            title: "Baño",
            img: "https://cdn.decorabano.com/image/upload/wp-db/wp-content/uploads/2021/09/como-limpiar-muebles-bano-2.jpg",
            path: "/catalogo?categoria=2"
        },
    ];

    return (
        <div className="home-wrapper">

            <header className={`hero-section ${heroInView ? 'fade-in' : ''}`} ref={heroRef}>
                <div className="hero-content">
                    <span className="subtitle">2026 año de cambio</span>
                    <h1>
                        Estética <span className="italic-accent">atemporal</span><br />
                        para tu hogar.
                    </h1>
                    <p>"Creamos muebles de madera noble hechos a mano, diseñados no solo para durar, sino para cuidarte. Adaptamos cada pieza a tu estatura para garantizar tu comodidad, con un precio ajustado a tus medidas reales</p>
                    <div className="hero-buttons">
                        <Link to="/catalogo" className="btn btn-dark">EXPLORAR COLECCIÓN</Link>
                        <button className="btn btn-light">VER VIDEO</button>
                    </div>
                </div>
                <div className="hero-image">
                    <img src="https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80" alt="Interior Minimalista" />
                </div>
            </header>

            <section className={`curated-section ${catInView ? 'fade-up' : ''}`} ref={catRef}>
                <div className="section-header-center">
                    <h2>Espacios para ti</h2>
                    <div className="separator"></div>
                </div>

                <div className="curated-grid">
                    {espaciosCurados.map((item, index) => (
                        <Link to={item.path} key={index} className="curated-card">
                            <img src={item.img} alt={item.title} />
                            <div className="curated-overlay">
                                <h3>{item.title}</h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <section className={`new-pieces-section ${carouselInView ? 'fade-up' : ''}`} ref={carouselRef}>
                <div className="section-header-flex">
                    <div className="header-titles">
                        <h2>Nuevas Piezas</h2>
                        <p>Diseño contemporáneo recién llegado al showroom.</p>
                    </div>
                    <Link to="/catalogo" className="view-all-link">Ver todo &rarr;</Link>
                </div>

                <div className="carousel-container-styled">
                    <ProductCarousel />
                </div>
            </section>
            <section className="benefits-bar">
                <div className="benefit-item">
                    <i className="fa-solid fa-truck-fast icon-gold"></i>
                    <div>
                        <h4>Envío Premium</h4>
                        <p>Retiro o despacho a Concepción y alrededores ¡Como más te convenga!</p>
                    </div>
                </div>
                <div className="divider-vertical"></div>
                <div className="benefit-item">
                    <i className="fa-solid fa-certificate icon-gold"></i>
                    <div>
                        <h4>Garantía</h4>
                        <p>Garantia por daños de despacho.</p>
                    </div>
                </div>
                <div className="divider-vertical"></div>
                <div className="benefit-item">
                    <i className="fa-solid fa-headset icon-gold"></i>
                    <div>
                        <h4>Personalizado</h4>
                        <p>Contacto directo con el vendedor, ¡Nosotros te contactamos!</p>
                    </div>
                </div>
            </section>

            <section className="testimonials-section">
                <h2 className="serif-title">Voces de nuestros clientes</h2>
                <div className="testimonials-grid">
                    <div className="testimonial-card">
                        <div className="user-header">
                            <div className="avatar">M</div>
                            <div>
                                <h4>María González</h4>
                                <div className="stars">★★★★★</div>
                            </div>
                        </div>
                        <p>"La calidad del sofá que compré superó mis expectativas. El servicio de entrega fue impecable y muy cuidadoso."</p>
                    </div>
                    <div className="testimonial-card">
                        <div className="user-header">
                            <div className="avatar">C</div>
                            <div>
                                <h4>Carlos Rodríguez</h4>
                                <div className="stars">★★★★★</div>
                            </div>
                        </div>
                        <p>"Excelente atención al cliente. Tuve una duda con las medidas y me asesoraron perfectamente por WhatsApp."</p>
                    </div>
                </div>
            </section>
            <section className={`journal-section ${journalInView ? 'fade-up' : ''}`} ref={journalRef}>
                <h2>SOMA Journal</h2>
                <p>Suscríbete para recibir inspiración, acceso anticipado a colecciones y un 10% en tu primera orden.</p>
                <div className="subscribe-form">
                    <input type="email" placeholder="Tu correo electrónico" />
                    <button>UNIRSE</button>
                </div>
            </section>

        </div>
    );
}