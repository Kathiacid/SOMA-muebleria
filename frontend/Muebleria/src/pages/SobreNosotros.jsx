import React from 'react';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './sobreNosotros.css';

const SobreNosotros = () => {
  return (
    <div className="sobre-nosotros-wrapper">
      
      {/* --- SECCIÓN 1: EL FUNDADOR (Fondo Blanco) --- */}
      <section className="section-founder">
        <div className="sobre-nosotros-container">
          
          <div className="about-image-col">
            <img 
              src="https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1000&auto=format&fit=crop" 
              alt="Mueble SOMA" 
              className="founder-img"
            />
            <div className="floating-quote">
              <p>"El mueble debe servir al cuerpo, no al revés."</p>
              <span>— ARQ. MATEO SOMA</span>
            </div>
          </div>

          <div className="about-text-col">
            <span className="eyebrow-text">El Fundador</span>
            <h1>
              La ergonomía como <em>pilar</em> de diseño.
            </h1>
            
            <div className="about-body-text">
              <p>
                Con más de 15 años de experiencia diseñando estructuras residenciales, 
                Mateo Soma notó un patrón recurrente: espacios hermosos arruinados por 
                mobiliario estandarizado que ignoraba la antropometría humana.
              </p>
              <p>
                SOMA nació de esa frustración y de una idea simple pero poderosa: 
                aplicar los principios de la arquitectura a la escala del mobiliario. 
                Cada silla, mesa y sofá se concibe analizando planos de sección y elevación.
              </p>
            </div>

            <div className="stats-row">
              <div className="stat-item">
                <strong>100%</strong>
                <span>MATERIALES NOBLES</span>
              </div>
              <div className="stat-item">
                <strong>0.618</strong>
                <span>PROPORCIÓN ÁUREA</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- SECCIÓN 2: NUESTRO ESPACIO (Fondo Beige) --- */}
      <section className="section-location">
        <div className="sobre-nosotros-container reverse-layout">
          
          <div className="about-text-col">
            <span className="eyebrow-text">Nuestro Espacio</span>
            <h2>Diseño desde Concepción</h2>
            
            <div className="about-body-text">
              <p>
                Ubicados en el corazón de la región del Biobío, nuestro estudio en Concepción 
                es un espacio donde la arquitectura y el mobiliario convergen. Te invitamos a 
                experimentar la materialidad y ergonomía de nuestras piezas en persona.
              </p>
            </div>

            <div className="features-list">
              <div className="feature-item">
                <div className="feature-icon">
                  <i className="fa-solid fa-store"></i>
                </div>
                <div className="feature-content">
                  <h4>Showroom & Estudio</h4>
                  <p>Un ambiente curado para inspirar y probar cada diseño en un entorno real.</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <i className="fa-solid fa-chair"></i>
                </div>
                <div className="feature-content">
                  <h4>Prueba de Ergonomía</h4>
                  <p>Siente la diferencia de alturas y profundidades con asesoría experta.</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <i className="fa-regular fa-calendar-check"></i>
                </div>
                <div className="feature-content">
                  <h4>Atención Personalizada</h4>
                  <p>Agenda una visita para recibir consultoría arquitectónica directa.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="about-image-col map-col">
            {/* Contenedor del Mapa/Imagen */}
            <div className="map-container">
                {/* Imagen de fondo (Mapa o Local) */}
                <img 
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop" 
                  alt="Mapa ubicación" 
                  className="map-bg"
                />
                
                {/* Tarjeta Flotante de Dirección */}
                <div className="location-card">
                    <div className="loc-header">
                        <h3>SOMA Concepción</h3>
                        <i className="fa-solid fa-location-arrow"></i>
                    </div>
                    <span className="loc-badge">CASA MATRIZ</span>
                    
                    <ul className="loc-details">
                        <li><i className="fa-solid fa-map-pin"></i> Av. Chacabuco 800, Concepción</li>
                        <li><i className="fa-regular fa-clock"></i> Lun - Vie: 10:00 - 19:00 hrs</li>
                    </ul>

                    <button className="btn-directions">CÓMO LLEGAR</button>
                </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default SobreNosotros;