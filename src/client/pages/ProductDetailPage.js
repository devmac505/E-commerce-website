import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ProductAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import ImageZoom from '../components/ImageZoom';
import ProductReviews from '../components/ProductReviews';

function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [activeImage, setActiveImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    // Reset state when product ID changes
    setProduct(null);
    setRelatedProducts([]);
    setReviews([]);
    setLoading(true);
    setError(null);
    setActiveImage(0);
    setAddedToCart(false);

    const fetchProductData = async () => {
      try {
        // Fetch main product data
        const productResponse = await ProductAPI.getProductById(id);

        if (productResponse.success && productResponse.data) {
          setProduct(productResponse.data);

          // After getting product, fetch related products and reviews in parallel
          Promise.all([
            ProductAPI.getRelatedProducts(id),
            ProductAPI.getProductReviews(id)
          ])
            .then(([relatedResponse, reviewsResponse]) => {
              // Handle related products
              if (relatedResponse.success && relatedResponse.data) {
                // Transform API data to match our expected format
                const formattedProducts = relatedResponse.data.map(product => ({
                  id: product._id,
                  name: product.name,
                  price: product.basePrice,
                  image: product.images && product.images.length > 0
                    ? product.images[0]
                    : '/images/products/placeholder.svg',
                  category: product.category?.name || 'Unknown',
                  gender: product.specifications?.gender || 'unisex'
                }));

                setRelatedProducts(formattedProducts);
              } else {
                // Use sample related products if API fails
                setRelatedProducts(getSampleRelatedProducts());
              }

              // Handle reviews
              if (reviewsResponse.success && reviewsResponse.data) {
                setReviews(reviewsResponse.data);
              } else {
                // Use sample reviews if API fails
                setReviews(getSampleReviews());
              }
            })
            .catch(error => {
              console.error('Error fetching related data:', error);
              // Use sample data as fallback
              setRelatedProducts(getSampleRelatedProducts());
              setReviews(getSampleReviews());
            });
        } else {
          // Use mock data if API fails
          const mockProduct = getMockProduct(id);
          setProduct(mockProduct);
          setRelatedProducts(getSampleRelatedProducts());
          setReviews(getSampleReviews());
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details. Please try again later.');
        // Use mock data as fallback
        const mockProduct = getMockProduct(id);
        setProduct(mockProduct);
        setRelatedProducts(getSampleRelatedProducts());
        setReviews(getSampleReviews());
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  const getMockProduct = (productId) => {
    return {
      _id: productId,
      name: 'Premium Athletic Running Shoes',
      basePrice: 79.99,
      sku: 'SH-ATH-001',
      stock: 150,
      description: 'High-quality athletic running shoes designed for comfort and performance. Features breathable mesh upper, cushioned midsole, and durable rubber outsole.',
      images: [
        '/images/products/running-shoes.jpg',
        '/images/products/running-shoes-2.jpg',
        '/images/products/running-shoes-3.jpg'
      ],
      category: { name: 'Athletic' },
      specifications: {
        gender: 'unisex',
        material: 'Synthetic mesh, rubber',
        weight: '280g',
        colors: ['Black/Red', 'Blue/White', 'Gray/Green']
      },
      volumeDiscounts: [
        { quantity: 50, price: 74.99 },
        { quantity: 100, price: 69.99 }
      ]
    };
  };

  // Sample related products for fallback
  const getSampleRelatedProducts = () => {
    return [
      {
        id: 'related1',
        name: 'Sports Training Shoes',
        price: 69.99,
        image: '/images/products/training-shoes.jpg',
        category: 'Athletic',
        gender: 'unisex'
      },
      {
        id: 'related2',
        name: 'Lightweight Running Shoes',
        price: 74.99,
        image: '/images/products/lightweight-shoes.jpg',
        category: 'Athletic',
        gender: 'unisex'
      },
      {
        id: 'related3',
        name: 'Trail Running Shoes',
        price: 89.99,
        image: '/images/products/trail-shoes.jpg',
        category: 'Athletic',
        gender: 'unisex'
      },
      {
        id: 'related4',
        name: 'Cushioned Walking Shoes',
        price: 64.99,
        image: '/images/products/walking-shoes.jpg',
        category: 'Athletic',
        gender: 'unisex'
      }
    ];
  };

  // Sample reviews for fallback
  const getSampleReviews = () => {
    return [
      {
        _id: 'review1',
        user: { name: 'John D.' },
        rating: 5,
        title: 'Excellent quality and comfort',
        comment: 'These shoes are perfect for my retail store. My customers love the comfort and style. The quality is excellent and they hold up well over time.',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
      },
      {
        _id: 'review2',
        user: { name: 'Sarah M.' },
        rating: 4,
        title: 'Good value for wholesale',
        comment: 'Great wholesale price point and my customers are happy with the product. Would like to see more color options in the future.',
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days ago
      },
      {
        _id: 'review3',
        user: { name: 'Michael T.' },
        rating: 4.5,
        title: 'Fast shipping, good product',
        comment: 'Received my bulk order quickly and the shoes are selling well in my store. The quality is good for the price point.',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days ago
      }
    ];
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    // Get current cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if product is already in cart
    const existingItemIndex = cart.findIndex(item => item.id === product._id);

    if (existingItemIndex >= 0) {
      // Update quantity if product already exists
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new product to cart
      cart.push({
        id: product._id,
        name: product.name,
        price: product.basePrice,
        image: product.images && product.images.length > 0 ? product.images[0] : '/images/products/placeholder.svg',
        quantity: quantity
      });
    }

    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Dispatch storage event for other components to detect the change
    window.dispatchEvent(new Event('storage'));

    // Show feedback to user
    setAddedToCart(true);

    // Reset the added to cart status after 3 seconds
    setTimeout(() => {
      setAddedToCart(false);
    }, 3000);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="product-detail skeleton-container">
          <div className="product-gallery skeleton"></div>
          <div className="product-info skeleton"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container">
        <div className="alert alert-danger">
          {error || 'Product not found'}
        </div>
        <Link to="/products" className="btn btn-primary">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="breadcrumbs">
        <Link to="/">Home</Link> &gt;
        <Link to="/products">Products</Link> &gt;
        <span>{product.name}</span>
      </div>

      <div className="product-detail">
        <div className="product-gallery">
          {/* Use ImageZoom component for main image */}
          <ImageZoom
            src={product.images?.[activeImage] || '/images/products/placeholder.svg'}
            alt={product.name}
          />

          {product.images && product.images.length > 1 && (
            <div className="thumbnail-images">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className={`thumbnail ${index === activeImage ? 'active' : ''}`}
                  onClick={() => setActiveImage(index)}
                >
                  <img src={image} alt={`${product.name} - View ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="product-info">
          <h1 id="productName">{product.name}</h1>

          <div className="product-meta">
            <p>SKU: <span id="productSku">{product.sku}</span></p>
            <p>Category: <span id="productCategory">{product.category?.name}</span></p>
            <p>Stock: <span id="stockLevel">{product.stock} units</span></p>
          </div>

          <div className="product-price">
            <h2 id="productPrice">${product.basePrice.toFixed(2)}</h2>
            {product.volumeDiscounts && product.volumeDiscounts.length > 0 && (
              <div className="volume-discounts">
                <p>Volume Discounts:</p>
                <ul>
                  {product.volumeDiscounts.map((discount, index) => (
                    <li key={index}>
                      {discount.quantity}+ units: ${discount.price.toFixed(2)} each
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="product-actions">
            <div className="quantity-control">
              <button className="quantity-btn" onClick={decrementQuantity}>-</button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
              />
              <button className="quantity-btn" onClick={incrementQuantity}>+</button>
            </div>

            <button
              className={`btn btn-primary ${addedToCart ? 'success' : ''}`}
              id="addToCartBtn"
              onClick={handleAddToCart}
            >
              {addedToCart ? (
                <>
                  <i className="fas fa-check"></i> Added to Cart
                </>
              ) : (
                'Add to Cart'
              )}
            </button>
          </div>

          <div className="product-tabs">
            <div className="tab-buttons">
              <button
                className={activeTab === 'description' ? 'active' : ''}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              <button
                className={activeTab === 'specifications' ? 'active' : ''}
                onClick={() => setActiveTab('specifications')}
              >
                Specifications
              </button>
              <button
                className={activeTab === 'shipping' ? 'active' : ''}
                onClick={() => setActiveTab('shipping')}
              >
                Shipping
              </button>
              <button
                className={activeTab === 'reviews' ? 'active' : ''}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews ({reviews.length})
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'description' && (
                <div className="tab-pane">
                  <p>{product.description}</p>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="tab-pane">
                  <ul className="specifications-list">
                    <li><strong>Gender:</strong> {product.specifications?.gender || 'Unisex'}</li>
                    <li><strong>Material:</strong> {product.specifications?.material || 'N/A'}</li>
                    <li><strong>Weight:</strong> {product.specifications?.weight || 'N/A'}</li>
                    <li><strong>Available Colors:</strong> {product.specifications?.colors?.join(', ') || 'N/A'}</li>
                  </ul>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="tab-pane">
                  <h4>Shipping Information</h4>
                  <p>Orders are typically processed within 1-2 business days.</p>
                  <p>Shipping times:</p>
                  <ul>
                    <li>Standard Shipping: 5-7 business days</li>
                    <li>Express Shipping: 2-3 business days</li>
                  </ul>
                  <p>For bulk orders (50+ units), please contact our wholesale department for special shipping arrangements.</p>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="tab-pane">
                  <ProductReviews reviews={reviews} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="related-products">
          <h2>Related Products</h2>
          <div className="product-grid">
            {relatedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetailPage;
