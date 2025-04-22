import React, { useState, useEffect } from 'react';

function Toast({ message, type = 'success', duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose && onClose();
      }, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeClasses = {
    success: 'bg-green-100 border-green-500 text-green-700',
    error: 'bg-red-100 border-red-500 text-red-700',
    warning: 'bg-yellow-100 border-yellow-500 text-yellow-700',
    info: 'bg-blue-100 border-blue-500 text-blue-700'
  };

  const iconClasses = {
    success: 'fas fa-check-circle text-green-500',
    error: 'fas fa-exclamation-circle text-red-500',
    warning: 'fas fa-exclamation-triangle text-yellow-500',
    info: 'fas fa-info-circle text-blue-500'
  };

  return (
    <div 
      className={`toast ${isVisible ? 'toast-visible' : 'toast-hidden'} ${typeClasses[type] || typeClasses.info}`}
      role="alert"
    >
      <div className="toast-content">
        <i className={`${iconClasses[type] || iconClasses.info} mr-2`}></i>
        <span>{message}</span>
      </div>
      <button 
        className="toast-close" 
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onClose && onClose(), 300);
        }}
      >
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
}

export default Toast;
