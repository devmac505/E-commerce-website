/**
 * Main JavaScript file
 * Handles site-wide functionality and initialization
 */

document.addEventListener('DOMContentLoaded', function() {
  // Set up navigation
  setupNavigation();
  
  // Set up product cards to link to product detail page
  setupProductLinks();
  
  // Initialize any components needed across the site
  initializeComponents();
  
  // Load product data
  loadProducts();
});

/**
 * Set up site navigation
 */
function setupNavigation() {
  const navLinks = document.querySelectorAll('.nav-links a');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const pageName = this.getAttribute('data-page');
      
      // Only handle internal page navigation
      if (pageName) {
        e.preventDefault();
        showPage(pageName);
      }
    });
  });
  
  // Handle explore products button
  const exploreBtn = document.getElementById('exploreProductsBtn');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', function() {
      showPage('products');
    });
  }
  
  // Handle category card clicks
  const categoryCards = document.querySelectorAll('.category-card');
  categoryCards.forEach(card => {
    card.addEventListener('click', function() {
      const category = this.getAttribute('data-category');
      showPage('products');
      
      // Set the category filter (if it exists)
      const categoryFilter = document.getElementById('categoryFilter');
      if (categoryFilter) {
        categoryFilter.value = category;
        // Trigger a change event to update the product list
        const event = new Event('change');
        categoryFilter.dispatchEvent(event);
      }
    });
  });
}

/**
 * Show a specific page by page name
 */
function showPage(pageName) {
  // Hide all pages
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => {
    page.classList.remove('active');
  });
  
  // Show the requested page
  const targetPage = document.getElementById(`${pageName}Page`);
  if (targetPage) {
    targetPage.classList.add('active');
  }
  
  // Update navigation
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-page') === pageName) {
      link.classList.add('active');
    }
  });
  
  // Scroll to top
  window.scrollTo(0, 0);
}

/**
 * Set up product cards to link to the product detail page
 */
function setupProductLinks() {
  // Function to attach click handlers to all product cards
  function attachProductCardHandlers() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
      // Find the view details button in each card
      const viewDetailsBtn = card.querySelector('.btn-primary');
      if (viewDetailsBtn) {
        viewDetailsBtn.addEventListener('click', function(e) {
          e.preventDefault();
          
          // Get product ID from the card's data attribute or from a nearby element
          const productId = card.getAttribute('data-product-id') || 'demo-product';
          
          // Redirect to product detail page with the product ID
          window.location.href = `product-detail.html?id=${productId}`;
        });
      }
    });
  }
  
  // Attach handlers immediately for any cards that exist on page load
  attachProductCardHandlers();
  
  // Set up a mutation observer to attach handlers to dynamically added cards
  const productGrids = document.querySelectorAll('.product-grid');
  if (productGrids.length > 0) {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // New nodes were added, reattach handlers
          attachProductCardHandlers();
        }
      });
    });
    
    // Observe each product grid for changes
    productGrids.forEach(grid => {
      observer.observe(grid, { childList: true, subtree: true });
    });
  }
}

/**
 * Initialize components used across the site
 */
function initializeComponents() {
  // Modal handling
  setupModals();
  
  // Authentication state
  checkAuthState();
  
  // Cart functionality
  setupCart();
}

/**
 * Set up modal dialogs
 */
function setupModals() {
  // Get all modal close buttons
  const closeButtons = document.querySelectorAll('.close-btn');
  
  // Add click handlers to all close buttons
  closeButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Find the parent modal
      const modal = this.closest('.modal');
      if (modal) {
        modal.style.display = 'none';
      }
    });
  });
  
  // Close modals when clicking outside
  window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
      event.target.style.display = 'none';
    }
  });
  
  // Modal toggle links
  const showLoginBtn = document.getElementById('showLoginModal');
  const showRegisterBtn = document.getElementById('showRegisterModal');
  const loginBtn = document.getElementById('loginBtn');
  const registerBtn = document.getElementById('registerBtn');
  const loginModal = document.getElementById('loginModal');
  const registerModal = document.getElementById('registerModal');
  
  if (showLoginBtn && loginModal) {
    showLoginBtn.addEventListener('click', function(e) {
      e.preventDefault();
      registerModal.style.display = 'none';
      loginModal.style.display = 'block';
    });
  }
  
  if (showRegisterBtn && registerModal) {
    showRegisterBtn.addEventListener('click', function(e) {
      e.preventDefault();
      loginModal.style.display = 'none';
      registerModal.style.display = 'block';
    });
  }
  
  if (loginBtn && loginModal) {
    loginBtn.addEventListener('click', function(e) {
      e.preventDefault();
      loginModal.style.display = 'block';
    });
  }
  
  if (registerBtn && registerModal) {
    registerBtn.addEventListener('click', function(e) {
      e.preventDefault();
      registerModal.style.display = 'block';
    });
  }
}

/**
 * Check authentication state and update UI accordingly
 */
function checkAuthState() {
  // For demo purposes we'll use local storage to maintain login state
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userName = localStorage.getItem('userName') || 'Guest';
  
  // Update UI based on login state
  const userNameElement = document.getElementById('userName');
  const authButtons = document.getElementById('authButtons');
  const logoutBtn = document.getElementById('logoutBtn');
  
  if (userNameElement) {
    userNameElement.textContent = userName;
  }
  
  if (authButtons && logoutBtn) {
    if (isLoggedIn) {
      authButtons.classList.add('hidden');
      logoutBtn.classList.remove('hidden');
    } else {
      authButtons.classList.remove('hidden');
      logoutBtn.classList.add('hidden');
    }
  }
  
  // Set up logout button
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      // Clear login state
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userName');
      
      // Refresh the page to update UI
      location.reload();
    });
  }
  
  // Set up login form submission
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      
      // In a real app, you would validate and send to your backend
      // For demo purposes, we'll just set the login state
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userName', email.split('@')[0]);
      
      // Close modal and refresh page
      document.getElementById('loginModal').style.display = 'none';
      location.reload();
    });
  }
}

/**
 * Set up shopping cart functionality
 */
function setupCart() {
  // Open cart modal when clicking the cart icon
  const cartIcon = document.querySelector('.cart-icon');
  const cartModal = document.getElementById('cartModal');
  
  if (cartIcon && cartModal) {
    cartIcon.addEventListener('click', function() {
      cartModal.style.display = 'block';
    });
  }
}

/**
 * Helper function to format currency
 */
function formatCurrency(amount) {
  return `$${parseFloat(amount).toFixed(2)}`;
}

/**
 * Load products data for the website
 */
function loadProducts() {
  // Load featured products on home page
  loadFeaturedProducts();
  
  // Load product grid on products page
  loadProductGrid();
}

/**
 * Load featured products on the home page
 */
function loadFeaturedProducts() {
  const featuredProductsGrid = document.getElementById('featuredProductsGrid');
  if (!featuredProductsGrid) return;
  
  // Clear loading placeholders
  featuredProductsGrid.innerHTML = '';
  
  // Sample featured products data
  const featuredProducts = [
    {
      id: 'athletic-1',
      name: 'Running Shoe Model X1',
      price: 89.99,
      image: 'images/products/product-athletic-1.svg',
      category: 'athletic',
      gender: 'unisex'
    },
    {
      id: 'formal-1',
      name: 'Business Oxford Leather',
      price: 129.99,
      image: 'images/products/product-formal-1.svg',
      category: 'formal',
      gender: 'men'
    },
    {
      id: 'casual-1',
      name: 'Everyday Canvas Sneaker',
      price: 65.99,
      image: 'images/products/product-casual-1.svg',
      category: 'casual',
      gender: 'unisex'
    },
    {
      id: 'boots-1',
      name: 'Premium Leather Boot',
      price: 159.99,
      image: 'images/products/product-boots-1.svg',
      category: 'boots',
      gender: 'men'
    }
  ];
  
  // Create and append product cards
  featuredProducts.forEach(product => {
    const productCard = createProductCard(product);
    featuredProductsGrid.appendChild(productCard);
  });
}

/**
 * Load products grid on the products page
 */
function loadProductGrid() {
  const productsGrid = document.getElementById('productsGrid');
  if (!productsGrid) return;
  
  // Sample product data
  const allProducts = [
    {
      id: 'athletic-1',
      name: 'Running Shoe Model X1',
      price: 89.99,
      image: 'images/products/product-athletic-1.svg',
      category: 'athletic',
      gender: 'unisex'
    },
    {
      id: 'formal-1',
      name: 'Business Oxford Leather',
      price: 129.99,
      image: 'images/products/product-formal-1.svg',
      category: 'formal',
      gender: 'men'
    },
    {
      id: 'casual-1',
      name: 'Everyday Canvas Sneaker',
      price: 65.99,
      image: 'images/products/product-casual-1.svg',
      category: 'casual',
      gender: 'unisex'
    },
    {
      id: 'boots-1',
      name: 'Premium Leather Boot',
      price: 159.99,
      image: 'images/products/product-boots-1.svg',
      category: 'boots',
      gender: 'men'
    },
    // Additional products with our new images
    {
      id: 'athletic-2',
      name: 'Trail Running Shoe',
      price: 95.99,
      image: 'images/products/product-athletic-2.svg',
      category: 'athletic',
      gender: 'women'
    },
    {
      id: 'formal-2',
      name: 'Classic Dress Shoe',
      price: 119.99,
      image: 'images/products/product-formal-2.svg',
      category: 'formal',
      gender: 'men'
    },
    {
      id: 'casual-2',
      name: 'Slip-on Canvas',
      price: 59.99,
      image: 'images/products/product-casual-1.svg', // Reusing image for demo
      category: 'casual',
      gender: 'unisex'
    },
    {
      id: 'boots-2',
      name: 'Winter Boot',
      price: 139.99,
      image: 'images/products/product-boots-1.svg', // Reusing image for demo
      category: 'boots',
      gender: 'women'
    }
  ];
  
  // Set up filter change handlers
  const categoryFilter = document.getElementById('categoryFilter');
  const genderFilter = document.getElementById('genderFilter');
  const sortBy = document.getElementById('sortBy');
  
  // Function to filter and display products
  function filterAndDisplayProducts() {
    // Clear loading placeholders
    productsGrid.innerHTML = '';
    
    // Get filter values
    const categoryValue = categoryFilter ? categoryFilter.value : '';
    const genderValue = genderFilter ? genderFilter.value : '';
    const sortValue = sortBy ? sortBy.value : '';
    
    // Filter products
    let filteredProducts = allProducts.filter(product => {
      let matchesCategory = true;
      let matchesGender = true;
      
      if (categoryValue) {
        matchesCategory = product.category === categoryValue;
      }
      
      if (genderValue) {
        matchesGender = product.gender === genderValue;
      }
      
      return matchesCategory && matchesGender;
    });
    
    // Sort products
    if (sortValue) {
      filteredProducts.sort((a, b) => {
        switch (sortValue) {
          case 'priceAsc':
            return a.price - b.price;
          case 'priceDesc':
            return b.price - a.price;
          case 'nameAsc':
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
    }
    
    // Create and append product cards
    filteredProducts.forEach(product => {
      const productCard = createProductCard(product);
      productsGrid.appendChild(productCard);
    });
  }
  
  // Add event listeners to filters
  if (categoryFilter) {
    categoryFilter.addEventListener('change', filterAndDisplayProducts);
  }
  
  if (genderFilter) {
    genderFilter.addEventListener('change', filterAndDisplayProducts);
  }
  
  if (sortBy) {
    sortBy.addEventListener('change', filterAndDisplayProducts);
  }
  
  // Initial load
  filterAndDisplayProducts();
}

/**
 * Create product card element
 */
function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.setAttribute('data-product-id', product.id);
  
  card.innerHTML = `
    <div class="product-image">
      <img src="${product.image}" alt="${product.name}">
    </div>
    <div class="product-info">
      <h3 class="product-name">${product.name}</h3>
      <p class="product-price">${formatCurrency(product.price)}</p>
      <div class="product-category">${product.category} • ${product.gender}</div>
      <div class="product-actions">
        <button class="btn btn-primary">View Details</button>
        <button class="btn btn-secondary add-to-cart" data-product-id="${product.id}">
          <i class="fas fa-shopping-cart"></i>
        </button>
      </div>
    </div>
  `;
  
  // Add event listener for add to cart button
  const addToCartBtn = card.querySelector('.add-to-cart');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      alert(`Added ${product.name} to cart!`);
      // In a real app, you would add the product to the cart here
    });
  }
  
  return card;
} 