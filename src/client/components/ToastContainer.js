import React, { useState, useEffect, useCallback } from 'react';
import Toast from './Toast';

// Create a custom event for showing toasts
export const showToast = (message, type = 'success', duration = 3000) => {
  const event = new CustomEvent('show-toast', { 
    detail: { message, type, duration, id: Date.now() } 
  });
  window.dispatchEvent(event);
};

function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ detail }) => {
    setToasts(prevToasts => [...prevToasts, detail]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  useEffect(() => {
    window.addEventListener('show-toast', addToast);
    return () => window.removeEventListener('show-toast', addToast);
  }, [addToast]);

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

export default ToastContainer;
