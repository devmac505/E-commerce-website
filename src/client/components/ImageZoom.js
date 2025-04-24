import React, { useState, useRef, useEffect } from 'react';

const ImageZoom = ({ src, alt }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  const handleMouseMove = (e) => {
    if (containerRef.current && imageRef.current) {
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      
      // Calculate position as percentage
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;
      
      setPosition({ x, y });
    }
  };

  // Fallback to default image if src is not available
  const imageSrc = src || '/images/products/product-placeholder.svg';

  return (
    <div 
      className={`image-zoom-container ${isZoomed ? 'zoomed' : ''}`}
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <img 
        ref={imageRef}
        src={imageSrc} 
        alt={alt || 'Product image'} 
        className="product-image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/images/products/product-placeholder.svg';
        }}
      />
      
      {isZoomed && (
        <div 
          className="zoomed-image" 
          style={{ 
            backgroundImage: `url(${imageSrc})`,
            backgroundPosition: `${position.x * 100}% ${position.y * 100}%`
          }}
        />
      )}
    </div>
  );
};

export default ImageZoom;
