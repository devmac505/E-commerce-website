/**
 * Product Detail Page JavaScript
 * This file handles all the functionality for the product detail page
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize page with product data
  loadProductDetails();
  
  // Set up event listeners
  setupEventListeners();
});

/**
 * Load product details from API or URL parameters
 */
function loadProductDetails() {
  // Get the product ID from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id') || 'demo-product';
  
  // In a real implementation, we would fetch the product details from an API
  // based on the product ID
  
  // For demo purposes, we'll use mock data based on the product ID
  let mockProduct = {};
  
  switch(productId) {
    case 'athletic-1':
      mockProduct = {
        id: 'athletic-1',
        name: 'Running Shoe Model X1',
        sku: 'RN-X1-001',
        category: 'Athletic',
        price: 89.99,
        stock: 250,
        images: [
          'images/products/product-athletic-1.svg',
          'images/products/product-athletic-1.svg',
          'images/products/product-athletic-1.svg'
        ],
        description: 'High-performance running shoes designed for comfort and speed. Features a lightweight mesh upper and responsive cushioning.',
        specifications: {
          material: 'Synthetic mesh, rubber',
          closure: 'Lace-up',
          sole: 'Rubber',
          weight: 'Approximately 280g per shoe (size 9)'
        },
        volumeDiscounts: [
          { min: 10, max: 49, price: 89.99 },
          { min: 50, max: 99, price: 84.99 },
          { min: 100, max: null, price: 79.99 }
        ],
        colors: ['black', 'white', 'blue', 'red'],
        sizes: [6, 7, 8, 9, 10, 11, 12]
      };
      break;
    
    case 'formal-1':
      mockProduct = {
        id: 'formal-1',
        name: 'Business Oxford Leather',
        sku: 'BZ-OX-001',
        category: 'Formal',
        price: 129.99,
        stock: 180,
        images: [
          'images/products/product-formal-1.svg',
          'images/products/product-formal-1.svg',
          'images/products/product-formal-1.svg'
        ],
        description: 'Classic Oxford shoes made with premium leather. Perfect for business professional attire with timeless style.',
        specifications: {
          material: 'Genuine leather, leather sole',
          closure: 'Lace-up',
          sole: 'Leather with rubber heel',
          weight: 'Approximately 350g per shoe (size 9)'
        },
        volumeDiscounts: [
          { min: 10, max: 49, price: 129.99 },
          { min: 50, max: 99, price: 119.99 },
          { min: 100, max: null, price: 109.99 }
        ],
        colors: ['black', 'brown', 'tan'],
        sizes: [7, 8, 9, 10, 11, 12]
      };
      break;
    
    case 'casual-1':
      mockProduct = {
        id: 'casual-1',
        name: 'Everyday Canvas Sneaker',
        sku: 'CV-SN-001',
        category: 'Casual',
        price: 65.99,
        stock: 320,
        images: [
          'images/products/product-casual-1.svg',
          'images/products/product-casual-1.svg',
          'images/products/product-casual-1.svg'
        ],
        description: 'Versatile canvas sneakers for everyday wear. Comfortable, durable, and stylish with a variety of color options.',
        specifications: {
          material: 'Canvas, rubber',
          closure: 'Lace-up',
          sole: 'Rubber',
          weight: 'Approximately 260g per shoe (size 9)'
        },
        volumeDiscounts: [
          { min: 10, max: 49, price: 65.99 },
          { min: 50, max: 99, price: 59.99 },
          { min: 100, max: null, price: 54.99 }
        ],
        colors: ['black', 'white', 'navy', 'red', 'green'],
        sizes: [5, 6, 7, 8, 9, 10, 11, 12]
      };
      break;
    
    case 'boots-1':
      mockProduct = {
        id: 'boots-1',
        name: 'Premium Leather Boot',
        sku: 'BT-LT-001',
        category: 'Boots',
        price: 159.99,
        stock: 150,
        images: [
          'images/products/product-boots-1.svg',
          'images/products/product-boots-1.svg',
          'images/products/product-boots-1.svg'
        ],
        description: 'High-quality leather boots with durable construction. Ideal for both style and function with water-resistant properties.',
        specifications: {
          material: 'Full-grain leather, rubber sole',
          closure: 'Lace-up',
          sole: 'Rubber',
          weight: 'Approximately 450g per boot (size 9)'
        },
        volumeDiscounts: [
          { min: 10, max: 49, price: 159.99 },
          { min: 50, max: 99, price: 149.99 },
          { min: 100, max: null, price: 139.99 }
        ],
        colors: ['black', 'brown', 'tan'],
        sizes: [7, 8, 9, 10, 11, 12, 13]
      };
      break;
    
    default:
      // Default product if ID not recognized
      mockProduct = {
        id: 'demo-product',
        name: 'Premium Athletic Shoes',
        sku: 'ATH-001',
        category: 'Athletic',
        price: 89.99,
        stock: 250,
        images: [
          'images/product-placeholder.svg',
          'images/product-placeholder.svg',
          'images/product-placeholder.svg'
        ],
        description: 'These premium athletic shoes are designed for maximum comfort and performance.',
        specifications: {
          material: 'Synthetic mesh, rubber',
          closure: 'Lace-up',
          sole: 'Rubber',
          weight: 'Approximately 280g per shoe (size 9)'
        },
        volumeDiscounts: [
          { min: 10, max: 49, price: 89.99 },
          { min: 50, max: 99, price: 84.99 },
          { min: 100, max: null, price: 79.99 }
        ],
        colors: ['black', 'white', 'red', 'blue'],
        sizes: [6, 7, 8, 9, 10, 11, 12]
      };
  }
  
  // Update the page with product data
  updateProductUI(mockProduct);
}

/**
 * Update the UI with product data
 */
function updateProductUI(product) {
  // Update product name
  document.getElementById('productName').textContent = product.name;
  document.getElementById('productDetailName').textContent = product.name;
  
  // Update product metadata
  document.getElementById('productSku').textContent = product.sku;
  document.getElementById('productCategory').textContent = product.category;
  document.getElementById('productPrice').textContent = `$${product.price.toFixed(2)}`;
  document.getElementById('stockLevel').textContent = product.stock;
  
  // Update images
  const mainProductImage = document.getElementById('mainProductImage');
  const thumbnailContainer = document.querySelector('.thumbnails');
  
  if (mainProductImage && product.images.length > 0) {
    mainProductImage.src = product.images[0];
    mainProductImage.alt = product.name;
  }
  
  if (thumbnailContainer) {
    // Clear existing thumbnails
    thumbnailContainer.innerHTML = '';
    
    // Add thumbnails for each image
    product.images.forEach((image, index) => {
      const thumbnail = document.createElement('div');
      thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
      thumbnail.setAttribute('data-image', image);
      
      thumbnail.innerHTML = `<img src="${image}" alt="${product.name} view ${index + 1}">`;
      thumbnailContainer.appendChild(thumbnail);
    });
  }
  
  // Update description
  const descriptionElement = document.getElementById('productDescription');
  if (descriptionElement) {
    descriptionElement.textContent = product.description;
  }
  
  // Update specifications
  const specsTable = document.getElementById('productSpecs');
  if (specsTable && product.specifications) {
    const tbody = specsTable.querySelector('tbody') || specsTable;
    tbody.innerHTML = '';
    
    for (const [key, value] of Object.entries(product.specifications)) {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${key.charAt(0).toUpperCase() + key.slice(1)}</td>
        <td>${value}</td>
      `;
      tbody.appendChild(row);
    }
  }
  
  // Update volume discount table
  const discountTable = document.getElementById('volumeDiscounts');
  if (discountTable && product.volumeDiscounts) {
    const tbody = discountTable.querySelector('tbody') || discountTable;
    tbody.innerHTML = '';
    
    product.volumeDiscounts.forEach(discount => {
      const row = document.createElement('tr');
      const quantityText = discount.max 
        ? `${discount.min}-${discount.max}` 
        : `${discount.min}+`;
      
      row.innerHTML = `
        <td>${quantityText}</td>
        <td>$${discount.price.toFixed(2)}</td>
      `;
      tbody.appendChild(row);
    });
  }
  
  // Update color and size options
  updateSelectOptions('colorSelect', product.colors);
  updateSelectOptions('sizeSelect', product.sizes);
  
  // Update page title for SEO
  document.title = `${product.name} - WholesaleFootwear`;
}

/**
 * Update options in a select element
 */
function updateSelectOptions(selectId, options) {
  const select = document.getElementById(selectId);
  if (!select || !options || !options.length) return;
  
  // Clear existing options
  select.innerHTML = '';
  
  // Add new options
  options.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option;
    optionElement.textContent = typeof option === 'string' 
      ? option.charAt(0).toUpperCase() + option.slice(1) 
      : option;
    select.appendChild(optionElement);
  });
}

/**
 * Set up all event listeners for the page
 */
function setupEventListeners() {
  // Thumbnail image clicking
  setupThumbnailListeners();
  
  // Tab switching
  setupTabListeners();
  
  // Quantity controls
  setupQuantityControls();
  
  // Add to cart button
  setupAddToCartButton();
  
  // Bulk order request button
  setupBulkOrderButton();
}

/**
 * Set up thumbnail image click listeners
 */
function setupThumbnailListeners() {
  const thumbnails = document.querySelectorAll('.thumbnail');
  const mainImage = document.getElementById('mainProductImage');
  
  thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', function() {
      // Remove active class from all thumbnails
      thumbnails.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked thumbnail
      this.classList.add('active');
      
      // Update main image
      const imgSrc = this.getAttribute('data-image');
      mainImage.src = imgSrc;
      mainImage.alt = this.querySelector('img').alt;
    });
  });
}

/**
 * Set up tab switching functionality
 */
function setupTabListeners() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons and panels
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabPanels.forEach(panel => panel.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Show the corresponding panel
      const tabId = this.getAttribute('data-tab');
      document.getElementById(`${tabId}Tab`).classList.add('active');
    });
  });
}

/**
 * Set up quantity input controls
 */
function setupQuantityControls() {
  const decreaseBtn = document.getElementById('decreaseQty');
  const increaseBtn = document.getElementById('increaseQty');
  const quantityInput = document.getElementById('quantityInput');
  const minQuantity = 10; // Minimum order quantity
  
  decreaseBtn.addEventListener('click', function() {
    let currentValue = parseInt(quantityInput.value);
    if (currentValue > minQuantity) {
      quantityInput.value = currentValue - 1;
      updatePriceBasedOnQuantity(currentValue - 1);
    }
  });
  
  increaseBtn.addEventListener('click', function() {
    let currentValue = parseInt(quantityInput.value);
    quantityInput.value = currentValue + 1;
    updatePriceBasedOnQuantity(currentValue + 1);
  });
  
  quantityInput.addEventListener('change', function() {
    let currentValue = parseInt(this.value);
    if (isNaN(currentValue) || currentValue < minQuantity) {
      this.value = minQuantity;
      currentValue = minQuantity;
    }
    updatePriceBasedOnQuantity(currentValue);
  });
}

/**
 * Update price based on quantity (volume discounts)
 */
function updatePriceBasedOnQuantity(quantity) {
  // In a real implementation, this would calculate the total price
  // based on the volume discounts and selected quantity
  
  // For demo purposes, we just update the UI with a calculated price
  const priceElement = document.getElementById('productPrice');
  let unitPrice = 45.00; // Default price
  
  if (quantity >= 100) {
    unitPrice = 40.00;
  } else if (quantity >= 50) {
    unitPrice = 42.50;
  }
  
  priceElement.textContent = `$${unitPrice.toFixed(2)}`;
}

/**
 * Set up add to cart button
 */
function setupAddToCartButton() {
  const addToCartBtn = document.getElementById('addToCartBtn');
  
  addToCartBtn.addEventListener('click', function() {
    // Get selected values
    const size = document.getElementById('sizeSelect').value;
    const color = document.getElementById('colorSelect').value;
    const quantity = parseInt(document.getElementById('quantityInput').value);
    
    // Validate selections
    if (!size || !color) {
      alert('Please select a size and color before adding to cart.');
      return;
    }
    
    // In a real implementation, we would add the item to the cart
    // For demo purposes, we'll just show a confirmation message
    alert(`Added ${quantity} pairs of size ${size} ${color} shoes to cart.`);
    
    // Update cart count in the header
    updateCartCount(quantity);
  });
}

/**
 * Update the cart count in the header
 */
function updateCartCount(addedQuantity) {
  const cartCountElement = document.getElementById('cartCount');
  let currentCount = parseInt(cartCountElement.textContent);
  cartCountElement.textContent = currentCount + addedQuantity;
}

/**
 * Set up bulk order request button
 */
function setupBulkOrderButton() {
  const bulkOrderBtn = document.getElementById('bulkOrderBtn');
  
  bulkOrderBtn.addEventListener('click', function() {
    // In a real implementation, this would open a modal or redirect to a quote request form
    // For demo purposes, we'll just show a confirmation message
    alert('A sales representative will contact you shortly to discuss your bulk order requirements.');
  });
}

/**
 * Helper function to format currency
 */
function formatCurrency(amount) {
  return `$${parseFloat(amount).toFixed(2)}`;
}

/**
 * Handle authentication state
 * In a real implementation, this would check if the user is logged in
 */
function checkAuthState() {
  // For demo purposes, we'll assume the user is not logged in
  const isLoggedIn = false;
  const userName = isLoggedIn ? 'John Doe' : 'Guest';
  
  // Update the UI based on authentication state
  document.getElementById('userName').textContent = userName;
  
  if (isLoggedIn) {
    document.getElementById('authButtons').classList.add('hidden');
    document.getElementById('logoutBtn').classList.remove('hidden');
  } else {
    document.getElementById('authButtons').classList.remove('hidden');
    document.getElementById('logoutBtn').classList.add('hidden');
  }
}

// Call checkAuthState on page load
checkAuthState(); 