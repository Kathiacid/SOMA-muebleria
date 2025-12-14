import React from 'react';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './sobreNosotros.css';

const SobreNosotros = () => {
  return (
    <div className="sobre-nosotros-wrapper">
      <section className="section-founder">
        <div className="sobre-nosotros-container">
          
          <div className="about-image-col">
            <img 
              src="https://d22fxaf9t8d39k.cloudfront.net/70e5aad3ab30a396e5a2861cbc51718366bbc1a16e6d22977968976dbff1032463808.png" 
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
                Con estudios en arquitectura, enfocado en la ergonomía, 
                Cristobal Fernandez notó un patrón recurrente: espacios hermosos arruinados por 
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
      <section className="section-location">
        <div className="sobre-nosotros-container reverse-layout">
          
          <div className="about-text-col">
            <span className="eyebrow-text">Nuestro Espacio</span>
            <h2>Diseño desde Concepción</h2>
            
            <div className="about-body-text">
              <p>
                Ubicados en el corazón de la región del Biobío,en Concepción creamos
                en un espacio donde la arquitectura y el mobiliario convergen. Te invitamos a 
                experimentar la materialidad y ergonomía de nuestras piezas en persona.
              </p>
            </div>

            <div className="features-list">
              <div className="feature-item">
                <div className="feature-icon">
                  <i className="fa-solid fa-store"></i>
                </div>
                <div className="feature-content">
                  <h4>Catalogo</h4>
                  <p>Productos centralizados en una sola pagina web.</p>
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
                  <p>Atencion directa por cooreo o puedes agendar una visita.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="about-image-col map-col">
            <div className="map-container">
                <img 
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop" 
                  alt="Mapa ubicación" 
                  className="map-bg"
                />
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