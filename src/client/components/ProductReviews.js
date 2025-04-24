import React, { useState } from 'react';
import { FaStar, FaUser } from './mock-icons';

const ProductReviews = ({ productId, initialReviews = [] }) => {
  const [reviews, setReviews] = useState(initialReviews);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    name: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview({
      ...newReview,
      [name]: value
    });
  };

  const handleRatingChange = (rating) => {
    setNewReview({
      ...newReview,
      rating
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!newReview.comment || !newReview.name || !newReview.email) {
      setError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // In a real app, you would send this to your API
      // const response = await fetch('/api/reviews', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     productId,
      //     ...newReview
      //   }),
      // });

      // if (!response.ok) {
      //   throw new Error('Failed to submit review');
      // }

      // Simulate API response
      const mockResponse = {
        _id: `review-${Date.now()}`,
        ...newReview,
        date: new Date().toISOString(),
        verified: false
      };

      // Add the new review to the list
      setReviews([mockResponse, ...reviews]);

      // Reset the form
      setNewReview({
        rating: 5,
        comment: '',
        name: '',
        email: ''
      });

      setSuccess('Your review has been submitted successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);

    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate stars for rating display
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={index < rating ? 'star filled' : 'star'}
      />
    ));
  };

  // Generate interactive stars for rating input
  const renderRatingInput = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={index < newReview.rating ? 'star filled' : 'star'}
        onClick={() => handleRatingChange(index + 1)}
      />
    ));
  };

  return (
    <div className="product-reviews">
      <h3>Customer Reviews</h3>

      {reviews.length === 0 ? (
        <p className="no-reviews">No reviews yet. Be the first to review this product!</p>
      ) : (
        <div className="reviews-summary">
          <div className="average-rating">
            <span className="rating-value">
              {(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)}
            </span>
            <div className="stars">
              {renderStars(Math.round(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length))}
            </div>
            <span className="review-count">Based on {reviews.length} reviews</span>
          </div>
        </div>
      )}

      <div className="review-form-container">
        <h4>Write a Review</h4>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="review-form">
          <div className="form-group">
            <label>Your Rating</label>
            <div className="rating-input">
              {renderRatingInput()}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="comment">Your Review</label>
            <textarea
              id="comment"
              name="comment"
              value={newReview.comment}
              onChange={handleInputChange}
              rows="4"
              placeholder="Share your experience with this product"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newReview.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Your Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={newReview.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
              <small>Your email will not be published</small>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>

      <div className="reviews-list">
        {reviews.length > 0 && (
          <>
            <h4>All Reviews</h4>
            {reviews.map((review) => (
              <div key={review._id} className="review-item">
                <div className="review-header">
                  <div className="reviewer-info">
                    <div className="reviewer-avatar">
                      <FaUser />
                    </div>
                    <div>
                      <div className="reviewer-name">{review.name}</div>
                      <div className="review-date">
                        {new Date(review.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="review-rating">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <div className="review-content">
                  <p>{review.comment}</p>
                </div>
                {review.verified && (
                  <div className="verified-badge">Verified Purchase</div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
