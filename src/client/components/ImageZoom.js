import React, { useState, useRef, useEffect } from 'react';

function ImageZoom({ src, alt }) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  // Calculate zoom position based on mouse position
  const handleMouseMove = (e) => {
    if (!containerRef.current || !isZoomed) return;
    
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    
    // Calculate position as percentage
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    // Update position state
    setPosition({ x, y });
  };

  // Toggle zoom state
  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  // Reset zoom when image changes
  useEffect(() => {
    setIsZoomed(false);
  }, [src]);

  return (
    <div 
      className={`image-zoom-container ${isZoomed ? 'zoomed' : ''}`}
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onClick={toggleZoom}
    >
      <img 
        ref={imageRef}
        src={src} 
        alt={alt} 
        className="main-image"
      />
      
      {isZoomed && (
        <div 
          className="zoomed-image"
          style={{
            backgroundImage: `url(${src})`,
            backgroundPosition: `${position.x}% ${position.y}%`
          }}
        />
      )}
      
      <div className="zoom-hint">
        <i className="fas fa-search-plus"></i>
        <span>Click to {isZoomed ? 'exit zoom' : 'zoom'}</span>
      </div>
    </div>
  );
}

export default ImageZoom;
