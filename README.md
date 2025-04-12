# B2B Wholesale Footwear Marketplace

A B2B e-commerce platform specialized for wholesale footwear trading.

## Features

- Product Management
  - Product listing with pagination and filtering
  - Product categories management
  - Product search functionality
  - Bulk pricing tiers
  - Inventory management

- User Authentication & Authorization (Coming Soon)
  - User registration and login
  - Role-based access (Admin, Wholesaler, Retailer)
  - Profile management
  - Password reset functionality

- Shopping Cart & Order Management (Coming Soon)
  - Add to cart with quantity validation
  - Bulk order handling
  - Order status tracking
  - Order history

## Tech Stack

- Node.js
- Express.js
- MongoDB
- JWT for authentication
- Other dependencies (see package.json)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/your-repo-name.git
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file in the root directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

4. Run the development server:
```bash
npm start
```

## API Documentation

### Products

- `GET /api/products` - Get all products (with pagination and filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `PUT /api/products/:id/inventory` - Update product inventory

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.