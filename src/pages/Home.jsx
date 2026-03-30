import React, { useState } from 'react';
import AppBar from '../components/AppBar';
import './Home.css';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const navigate = useNavigate();

  const galleryImages = [
    { src: '/public/media/images/img1.jpeg', title: 'Jardín de bienvenida' },
    { src: '/public/media/images/img2.jpeg', title: 'Sala acogedora' },
    { src: '/public/media/images/img3.jpeg', title: 'Comedor elegante' },
    { src: '/public/media/images/img4.jpeg', title: 'Habitación con luz natural' },
    { src: '/public/media/images/img5.jpeg', title: 'Paisaje exterior' },
    { src: '/public/media/images/img6.jpeg', title: 'Terraza relajante' }
  ];

  return (
    <div className="home-bg">
      <AppBar></AppBar>
      <header>
        <div className="hero">
          <video autoPlay muted loop playsInline className="hero-video">
            <source src="/public/media/videos/frontvideo.mp4" type="video/mp4" />
          </video>

          <div className="overlay"></div>

          <div className="hero-content">
            <h1 className="roboto-condensed">Casa Sanué</h1>
            <p className="roboto-condensed">Donde el Alma descansa</p>
            <button className="btn-reservar" onClick={() => navigate('/reservations')}>
              Reservar ahora
            </button>
          </div>
        </div>
      </header>
      <div className="content">
        <section className="about">
          <h2>Galería de Casa Sanué</h2>
          <div className="gallery">
            {galleryImages.map((image, index) => (
              <figure
                key={image.src}
                className="gallery-item"
                style={{ animationDelay: `${index * 80}ms` }}
                onClick={() => setSelectedImage(image)}
              >
                <img className="gallery-image" src={image.src} alt={image.title} />
                <figcaption className="gallery-caption">
                  <span>{image.title}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="map-section">
          <div className="map-card">
            <div>
              <h2>Ubicación de Casa Sanué</h2>
              <p className="parrafo">
                Mira dónde estamos ubicados en Google Maps y planifica tu llegada con un clic.
              </p>
            </div>
            <button className="btn-map" onClick={() => setShowMapModal(true)}>
              Ver en el mapa
            </button>
          </div>
        </section>
      </div>

      {selectedImage && (
        <div className="gallery-modal" onClick={() => setSelectedImage(null)}>
          <div className="gallery-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="gallery-close" onClick={() => setSelectedImage(null)}>
              ×
            </button>
            <img src={selectedImage.src} alt={selectedImage.title} />
            <div className="modal-info">
              <h3>{selectedImage.title}</h3>
              <p>Explora cada espacio con calma y disfruta la experiencia Casa Sanue.</p>
            </div>
          </div>
        </div>
      )}

      {showMapModal && (
        <div className="map-modal" onClick={() => setShowMapModal(false)}>
          <div className="map-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowMapModal(false)}>
              ×
            </button>
            <div className="map-frame-wrapper">
              <iframe
                className="maps-iframe"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.333313893223!2d-74.773612424958!3d10.78576328936361!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8ef5cf2862515ee1%3A0xe16480c746b9f8f2!2sCasa%20Sanu%C3%A9!5e0!3m2!1ses-419!2sco!4v1774842383153!5m2!1ses-419!2sco"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de Casa Sanué"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
