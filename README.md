# WholesaleFootwear - B2B Shoe Marketplace

A modern React-based e-commerce platform for wholesale footwear distribution.

## Features

- Product Management
  - Product listing with pagination and filtering
  - Product categories management
  - Product search functionality
  - Bulk pricing tiers
  - Inventory management

- User Authentication & Authorization
  - User registration and login
  - Role-based access (Admin, Wholesaler, Retailer)
  - Profile management
  - Password reset functionality

- Shopping Cart & Order Management
  - Add to cart with quantity validation
  - Bulk order handling
  - Order status tracking
  - Order history

## Tech Stack

- Frontend:
  - React.js
  - React Router for navigation
  - CSS for styling

- Backend:
  - Node.js
  - Express.js
  - MongoDB
  - JWT for authentication

## Project Structure

```
├── public/               # Static assets and compiled React app
│   ├── dist/             # Compiled React app
│   ├── images/           # Image assets
│   └── react-index.html  # Main HTML file for React app
├── src/
│   ├── client/           # React frontend
│   │   ├── assets/       # CSS and other assets
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── App.js        # Main React component
│   │   └── index.js      # React entry point
│   ├── config/           # Server configuration
│   ├── controllers/      # API controllers
│   ├── middleware/       # Express middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   └── app.js            # Express server entry point
```

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
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. Run the development server:
```bash
npm run dev
```

This will start:
- The Express server on port 4000
- The React development server with hot reloading

5. For production build:
```bash
npm run build
npm run prod
```

## API Documentation

### Products

- `GET /api/products` - Get all products (with pagination and filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `PUT /api/products/:id/inventory` - Update product inventory

### Users

- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Orders

- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.
