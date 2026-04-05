import React, { useState } from 'react';
import AppBar from '../components/AppBar';
import './Home.css';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const navigate = useNavigate();

  const openCategoryModal = (category) => {
    setSelectedCategory(category);
  };

  const closeCategoryModal = () => {
    setSelectedCategory(null);
    setSelectedImage(null);
  };

  const openImageLightbox = (image) => {
    setSelectedImage(image);
  };

  const closeImageLightbox = () => {
    setSelectedImage(null);
  };

  const categories = [
    {
      id: 'kiosco',
      name: 'Kiosco Principal',
      mainImage: '/public/media/images/kiosco all image.jpeg',
      description: 'El corazón de Casa Sanué',
      images: [
        { src: '/public/media/images/kiosco all image.jpeg', title: 'Vista completa del Kiosco' },
        { src: '/public/media/images/img1.jpeg', title: 'Kiosco Primer Nivel' },
        { src: '/public/media/images/billar.jpeg', title: 'Sala de billar' },
        { src: '/public/media/images/kiostop.jpeg', title: 'Kiosco Segundo Nivel' },
        { src: '/public/media/images/kiostop2.jpeg', title: 'Kiosco Segundo Nivel Vista' },
        { src: '/public/media/images/kiostop3.jpeg', title: 'Kiosco Segundo Nivel Vista' }
      ]
    },
    {
      id: 'cocina',
      name: 'Cocina & Comedor',
      mainImage: '/public/media/images/img2.jpeg',
      description: 'Espacios culinarios elegantes',
      images: [
        { src: '/public/media/images/cocina.jpeg', title: 'Cocina vista general' },
        { src: '/public/media/images/img2.jpeg', title: 'Comedor principal' },
        { src: '/public/media/images/img3.jpeg', title: 'Comedor elegante' },
        { src: '/public/media/images/angulo.jpg', title: 'Vistas' },
      ]
    },
    {
      id: 'exteriores',
      name: 'Zonas Exteriores',
      mainImage: '/public/media/images/patio.jpg',
      description: 'Otras Areas',
      images: [
        { src: '/public/media/images/portada.jpeg', title: 'Entrada principal' },
        { src: '/public/media/images/patio.jpg', title: 'Patio trasero' },
        { src: '/public/media/images/jardin.jpg', title: 'Jardin exterior' },
        { src: '/public/media/images/parking.jpg', title: 'Parqueadero con techo absorbente de sol' }
      ]
    },
    {
      id: 'entretenimiento',
      name: 'Entretenimiento',
      mainImage: '/public/media/images/barbbq.jpg',
      description: 'Diversión y recreación',
      images: [
        { src: '/public/media/images/img4.jpeg', title: 'Zona BBQ' },
        { src: '/public/media/images/img5.jpeg', title: 'Bar y zona social' },
        { src: '/public/media/images/barbbq.jpg', title: 'Bar y BBQ vista externa' },
        { src: '/public/media/images/billar.jpeg', title: 'Sala de billar' },
        { src: '/public/media/images/pisicna.jpeg', title: 'Piscina' },
        { src: '/public/media/images/barangul.jpg', title: 'Punto de vista del Bar' }
      ]
    },
    {
      id: 'living-room',
      name: 'Living Room',
      mainImage: '/public/media/images/img6.jpeg',
      description: 'El corazón de Casa Sanué',
      images: [
        { src: '/public/media/images/img6.jpeg', title: 'Sala de estar' },
        { src: '/public/media/images/sala.jpg', title: 'Sala de estar vista general' }
      ]
    },
    {
      id: 'videos',
      name: 'Videos',
      mainImage: '/public/media/images/portada.jpeg',
      description: 'Videos de Casa Sanué',
      images: [
        { src: '/public/media/videos/general.mp4', title: 'Vista General' },
        { src: '/public/media/videos/kios.mp4', title: 'Vista del kiosco' },
        { src: '/public/media/videos/video.mp4', title: 'general' }
      ]
    },
    {
      id: 'habitaciones',
      name: 'Habitaciones',
      mainImage: '/public/media/images/camarotes.jpeg',
      description: 'Espacios de descanso y comodidad',
      images: [
        { src: '/public/media/images/habita2.jpg', title: 'Habitación' },
        { src: '/public/media/images/vcamarote.jpg', title: 'Habitación secundaria' },
        { src: '/public/media/images/camarotes.jpeg', title: 'Camarotes' },
        { src: '/public/media/images/vscamarote.jpg', title: 'Vista del camarote' },
        { src: '/public/media/images/bath.jpg', title: 'Baño' },
        { src: '/public/media/images/angbath.jpg', title: 'Vista del Baño' },
        { src: '/public/media/images/puerta.jpeg', title: 'Puerta del baño' }
      ]
    }
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
            <h1 className="roboto-condensed ">Casa Sanué</h1>
            <p className="roboto-condensed texto-dorado-sombra">Donde el Alma descansa</p>
            <button className="btn-reservar" onClick={() => navigate('/reservations')}>
              Reservar ahora
            </button>
          </div>
        </div>
      </header>
      <div className="content">
        <section className="about">
          <h2 className="texto-dorado-sombra">Descubre Casa Sanué</h2>
          <p className="section-description">
            Explora cada rincón de nuestra finca a través de nuestras categorías fotográficas
          </p>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className="category-card"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => openCategoryModal(category)}
              >
                <div className="category-image-container">
                  <img src={category.mainImage} alt={category.name} className="category-image" />
                  <div className="category-overlay">
                    <h3 className="category-title">{category.name}</h3>
                    <p className="category-description">{category.description}</p>
                    <div className="category-badge">{category.images.length} fotos</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="map-section">
          <div className="map-card">
            <div>
              <h2 className="texto-dorado-sombra">Ubicación de Casa Sanué</h2>
              <p className="parrafo">Mira dónde estamos ubicados en Google Maps y planifica tu llegada con un clic.</p>
            </div>
            <button className="Btn2" onClick={() => setShowMapModal(true)}></button>
          </div>
        </section>
      </div>

      {/* Modal simple para categorías */}
      {selectedCategory && (
        <div className="simple-modal-overlay" onClick={closeCategoryModal}>
          <div className="simple-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="simple-modal-close" onClick={closeCategoryModal}>
              ×
            </button>
            <h2 className="simple-modal-title">{selectedCategory.name}</h2>
            {selectedCategory.video && (
              <div className="category-video">
                <video autoPlay muted loop playsInline className="category-video-player">
                  <source src={selectedCategory.video} type="video/mp4" />
                  Tu navegador no soporta el elemento de video.
                </video>
              </div>
            )}
            <div className="simple-images-grid">
              {selectedCategory.images.map((item, index) => {
                const isVideo = item.src.toLowerCase().endsWith('.mp4');
                return (
                  <div key={index} className="simple-image-item" onClick={() => !isVideo && openImageLightbox(item)}>
                    {isVideo ? (
                      <video
                        className="category-grid-video"
                        loop
                        autoPlay
                        muted
                        playsInline
                        // controls  ← quita este atributo si está
                      >
                        <source src={item.src} type="video/mp4" />
                        Tu navegador no soporta el elemento de video.
                      </video>
                    ) : (
                      <img src={item.src} alt={item.title} />
                    )}
                    <div className="simple-image-title">{item.title}</div>
                  </div>
                );
              })}
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

      {/* Lightbox para imágenes */}
      {selectedImage && (
        <div className="lightbox-overlay" onClick={closeImageLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeImageLightbox}>
              ×
            </button>
            <img src={selectedImage.src} alt={selectedImage.title} className="lightbox-image" />
            <div className="lightbox-title">{selectedImage.title}</div>
          </div>
        </div>
      )}
    </div>
  );
}
