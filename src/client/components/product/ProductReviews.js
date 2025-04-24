import React, { useState } from 'react';

function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      user: 'John D.',
      rating: 5,
      date: '2023-10-15',
      comment: 'Excellent quality shoes. Very comfortable and durable.',
      avatar: 'https://via.placeholder.com/50x50/1a2238/ffffff?text=JD'
    },
    {
      id: 2,
      user: 'Sarah M.',
      rating: 4,
      date: '2023-09-22',
      comment: 'Good value for the price. Shipping was fast.',
      avatar: 'https://via.placeholder.com/50x50/1a2238/ffffff?text=SM'
    },
    {
      id: 3,
      user: 'Robert K.',
      rating: 3,
      date: '2023-08-30',
      comment: 'Average quality. The size runs a bit small.',
      avatar: 'https://via.placeholder.com/50x50/1a2238/ffffff?text=RK'
    }
  ]);
  
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const handleRatingChange = (rating) => {
    setNewReview({ ...newReview, rating });
  };
  
  const handleCommentChange = (e) => {
    setNewReview({ ...newReview, comment: e.target.value });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!newReview.comment.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const review = {
        id: reviews.length + 1,
        user: 'You',
        rating: newReview.rating,
        date: new Date().toISOString().split('T')[0],
        comment: newReview.comment,
        avatar: 'https://via.placeholder.com/50x50/1a2238/ffffff?text=You'
      };
      
      setReviews([review, ...reviews]);
      setNewReview({ rating: 5, comment: '' });
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    }, 1000);
  };
  
  const renderStars = (rating) => {
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i 
          key={i}
          className={`fas fa-star ${i <= rating ? 'filled' : ''}`}
        ></i>
      );
    }
    
    return stars;
  };
  
  return (
    <div className="product-reviews">
      <h3>Customer Reviews</h3>
      
      <div className="review-form-container">
        <h4>Write a Review</h4>
        <form onSubmit={handleSubmit} className="review-form">
          <div className="rating-selector">
            <span>Your Rating:</span>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <i
                  key={star}
                  className={`fas fa-star ${star <= newReview.rating ? 'filled' : ''}`}
                  onClick={() => handleRatingChange(star)}
                ></i>
              ))}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="review-comment">Your Review:</label>
            <textarea
              id="review-comment"
              value={newReview.comment}
              onChange={handleCommentChange}
              placeholder="Share your experience with this product..."
              rows="4"
              required
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting || !newReview.comment.trim()}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
          
          {submitSuccess && (
            <div className="success-message">
              Your review has been submitted successfully!
            </div>
          )}
        </form>
      </div>
      
      <div className="reviews-list">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <div className="reviewer-info">
                  <img src={review.avatar} alt={review.user} className="reviewer-avatar" />
                  <div>
                    <div className="reviewer-name">{review.user}</div>
                    <div className="review-date">{review.date}</div>
                  </div>
                </div>
                <div className="review-rating">
                  {renderStars(review.rating)}
                </div>
              </div>
              <div className="review-comment">
                {review.comment}
              </div>
            </div>
          ))
        ) : (
          <div className="no-reviews">
            No reviews yet. Be the first to review this product!
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductReviews;
