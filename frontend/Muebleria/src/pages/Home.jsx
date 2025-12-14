import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCarousel from "../components/ProductCarousel";
import "./Home.css";
import { useInView } from 'react-intersection-observer'; 

export default function Home() {
    // Refs para animaciones
    const [heroRef, heroInView] = useInView({ threshold: 0.1 });
    const [catRef, catInView] = useInView({ threshold: 0.1 });
    const [carouselRef, carouselInView] = useInView({ threshold: 0.1 });
    const [journalRef, journalInView] = useInView({ threshold: 0.1 });

    // Datos estáticos para "Espacios Curados" (replicando la imagen)
    const espaciosCurados = [
        { title: "Salas", img: "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=600&q=80" },
        { title: "Comedor", img: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=600&q=80" },
        { title: "Mesas", img: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=600&q=80" },
        { title: "Iluminación", img: "https://images.unsplash.com/photo-1513506003013-19c6cd086952?auto=format&fit=crop&w=600&q=80" },
    ];

    return (
        <div className="home-wrapper">

            <header className={`hero-section ${heroInView ? 'fade-in' : ''}`} ref={heroRef}>
                <div className="hero-content">
                    <span className="subtitle">COLECCIÓN OTOÑO 2024</span>
                    <h1>
                        Estética <span className="italic-accent">atemporal</span><br />
                        para tu hogar.
                    </h1>
                    <p>Redefinimos el lujo cotidiano con piezas que combinan funcionalidad, materiales nobles y un diseño que perdura.</p>
                    <div className="hero-buttons">
                        <Link to="/catalogo" className="btn btn-dark">EXPLORAR COLECCIÓN</Link>
                        <button className="btn btn-light">VER VIDEO</button>
                    </div>
                </div>
                <div className="hero-image">
                    {/* Imagen lateral derecha difuminada/blanca como el diseño */}
                    <img src="https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80" alt="Interior Minimalista" />
                </div>
            </header>

            {/* 2. ESPACIOS CURADOS (Grid de 4) */}
            <section className={`curated-section ${catInView ? 'fade-up' : ''}`} ref={catRef}>
                <div className="section-header-center">
                    <h2>Espacios Curados</h2>
                    <div className="separator"></div>
                </div>
                
                <div className="curated-grid">
                    {espaciosCurados.map((item, index) => (
                        <div key={index} className="curated-card">
                            <img src={item.img} alt={item.title} />
                            <div className="curated-overlay">
                                <h3>{item.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. NUEVAS PIEZAS (Tu Carousel) */}
            <section className={`new-pieces-section ${carouselInView ? 'fade-up' : ''}`} ref={carouselRef}>
                <div className="section-header-flex">
                    <div className="header-titles">
                        <h2>Nuevas Piezas</h2>
                        <p>Diseño contemporáneo recién llegado al showroom.</p>
                    </div>
                    <Link to="/catalogo" className="view-all-link">Ver todo &rarr;</Link>
                </div>

                {/* Contenedor del carrusel existente */}
                <div className="carousel-container-styled">
                    <ProductCarousel />
                </div>
            </section>

            {/* 4. BENEFICIOS (Franja Oscura) */}
            <section className="benefits-bar">
                <div className="benefit-item">
                    <i className="fa-solid fa-truck-fast icon-gold"></i>
                    <div>
                        <h4>Envío Premium</h4>
                        <p>Logística especializada para el cuidado de tus muebles.</p>
                    </div>
                </div>
                <div className="divider-vertical"></div>
                <div className="benefit-item">
                    <i className="fa-solid fa-certificate icon-gold"></i>
                    <div>
                        <h4>Garantía Extendida</h4>
                        <p>Protección de 2 años en estructura y materiales.</p>
                    </div>
                </div>
                <div className="divider-vertical"></div>
                <div className="benefit-item">
                    <i className="fa-solid fa-headset icon-gold"></i>
                    <div>
                        <h4>Asesoramiento</h4>
                        <p>Expertos en interiorismo disponibles para guiar tu compra.</p>
                    </div>
                </div>
            </section>

            {/* 5. TESTIMONIOS (Voces de clientes) */}
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

            {/* 6. SOMA JOURNAL (Footer CTA - Color Terracota) */}
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