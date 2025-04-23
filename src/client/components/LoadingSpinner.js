import React from 'react';

function LoadingSpinner({ size = 'medium', color = 'accent' }) {
  const sizeClass = {
    small: 'loading-spinner-small',
    medium: 'loading-spinner-medium',
    large: 'loading-spinner-large'
  }[size] || 'loading-spinner-medium';

  const colorClass = {
    primary: 'loading-spinner-primary',
    accent: 'loading-spinner-accent',
    white: 'loading-spinner-white'
  }[color] || 'loading-spinner-accent';

  return (
    <div className="loading-spinner-container">
      <div className={`loading-spinner ${sizeClass} ${colorClass}`} role="status" aria-label="Loading">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

export default LoadingSpinner;
