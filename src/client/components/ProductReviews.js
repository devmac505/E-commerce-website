import React from 'react';

function ProductReviews({ reviews }) {
  // Calculate average rating
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Generate star rating display
  const renderStars = (rating) => {
    const stars = [];
    
    // Full stars
    for (let i = 1; i <= Math.floor(rating); i++) {
      stars.push(<i key={`star-${i}`} className="fas fa-star"></i>);
    }
    
    // Half star
    if (rating % 1 >= 0.5) {
      stars.push(<i key="star-half" className="fas fa-star-half-alt"></i>);
    }
    
    // Empty stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 1; i <= emptyStars; i++) {
      stars.push(<i key={`star-empty-${i}`} className="far fa-star"></i>);
    }
    
    return stars;
  };
  
  // Generate rating distribution
  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0]; // 5 stars, 4 stars, 3 stars, 2 stars, 1 star
    
    reviews.forEach(review => {
      const ratingIndex = Math.floor(review.rating) - 1;
      if (ratingIndex >= 0 && ratingIndex < 5) {
        distribution[ratingIndex]++;
      }
    });
    
    return distribution.reverse(); // Reverse to show 5 stars first
  };
  
  const ratingDistribution = getRatingDistribution();
  const totalReviews = reviews.length;
  
  return (
    <div className="product-reviews">
      {reviews.length > 0 ? (
        <>
          <div className="reviews-summary">
            <div className="average-rating">
              <div className="rating-number">{averageRating.toFixed(1)}</div>
              <div className="rating-stars">{renderStars(averageRating)}</div>
              <div className="total-reviews">{totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}</div>
            </div>
            
            <div className="rating-distribution">
              {ratingDistribution.map((count, index) => {
                const starNumber = 5 - index;
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                
                return (
                  <div key={`dist-${starNumber}`} className="rating-bar">
                    <div className="rating-label">{starNumber} stars</div>
                    <div className="rating-progress">
                      <div 
                        className="rating-progress-fill" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="rating-count">{count}</div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="reviews-list">
            <h3>Customer Reviews</h3>
            
            {reviews.map((review, index) => (
              <div key={review._id || index} className="review-item">
                <div className="review-header">
                  <div className="reviewer-name">{review.user?.name || 'Anonymous'}</div>
                  <div className="review-date">{formatDate(review.createdAt)}</div>
                </div>
                
                <div className="review-rating">{renderStars(review.rating)}</div>
                
                {review.title && (
                  <div className="review-title">{review.title}</div>
                )}
                
                <div className="review-content">{review.comment}</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="no-reviews">
          <p>This product has no reviews yet.</p>
        </div>
      )}
    </div>
  );
}

export default ProductReviews;
