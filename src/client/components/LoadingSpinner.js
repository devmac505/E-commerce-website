import React from 'react';

function LoadingSpinner({ size = 'medium', color = 'accent' }) {
  const sizeClass = {
    small: 'w-6 h-6 border-2',
    medium: 'w-10 h-10 border-3',
    large: 'w-16 h-16 border-4'
  }[size] || 'w-10 h-10 border-3';

  const colorClass = {
    primary: 'border-primary',
    accent: 'border-accent',
    white: 'border-white'
  }[color] || 'border-accent';

  return (
    <div className="flex justify-center items-center">
      <div className={`loading-spinner ${sizeClass} ${colorClass}`} role="status" aria-label="Loading">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

export default LoadingSpinner;
