# E-Commerce API

A B2B e-commerce platform for wholesale fashion footwear.

## Features

- User authentication and authorization (retailers and administrators)
- Product management with categorization and search functionality
- Order processing and management
- Wholesale pricing and bulk ordering
- User profile and company management

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **API Testing**: Postman

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- NPM or Yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ecommerce-api.git
   cd ecommerce-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   NODE_ENV=development
   PORT=3000
   MONGO_URI_DEV=mongodb://localhost:27017/b2b-shoes-dev
   JWT_SECRET=your_jwt_secret
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Testing with Postman

This repository includes Postman collection and environment files to help test the API endpoints.

1. Import the `ecommerce-api.postman_collection.json` file into Postman
2. Import the appropriate environment file based on your needs:
   - `postman_environment_dev.json` for development
   - `postman_environment_test.json` for testing
   - `postman_environment_prod.json` for production
3. Follow the instructions in `POSTMAN_USAGE.md` for detailed usage

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `GET /api/auth/logout` - User logout

### Products
- `GET /api/products` - Get all products
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get a specific product
- `POST /api/products` - Create a new product (admin only)
- `PUT /api/products/:id` - Update a product (admin only)
- `DELETE /api/products/:id` - Delete a product (admin only)

### Orders
- `GET /api/orders` - Get all orders for the current user
- `GET /api/orders/:id` - Get a specific order
- `POST /api/orders` - Create a new order
- `PUT /api/orders/:id` - Update order status (admin only)
- `GET /api/orders/admin/all` - Get all orders (admin only)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Your Name - your.email@example.com

Project Link: [https://github.com/your-username/ecommerce-api](https://github.com/your-username/ecommerce-api) 