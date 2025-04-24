import React, { useState } from 'react';

function ImageZoom({ src, alt }) {
  const [isZoomed, setIsZoomed] = useState(false);

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className={`image-zoom-container ${isZoomed ? 'zoomed' : ''}`} onClick={toggleZoom}>
      <img 
        src={src} 
        alt={alt} 
        className="zoom-image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://via.placeholder.com/600x600/1a2238/ffffff?text=Product+Image';
        }}
      />
      {isZoomed && (
        <div className="zoom-overlay">
          <div className="zoom-instructions">Click to close</div>
        </div>
      )}
    </div>
  );
}

export default ImageZoom;
