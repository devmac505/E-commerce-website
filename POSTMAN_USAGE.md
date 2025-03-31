# Using Postman with the E-Commerce API

This guide explains how to use Postman to test the E-Commerce API endpoints.

## Prerequisites

1. Download and install [Postman](https://www.postman.com/downloads/)
2. Make sure your E-Commerce API server is running

## Setup

### Importing the Collection

1. Open Postman
2. Click on "Import" in the top left
3. Choose "File" and select the `ecommerce-api.postman_collection.json` file from this project
4. Click "Import"

### Importing Environments

1. Click on "Import" in the top left
2. Choose "File" and select one of the environment files:
   - `postman_environment_dev.json` (Development)
   - `postman_environment_test.json` (Testing)
   - `postman_environment_prod.json` (Production)
3. Repeat for each environment you want to import
4. In the top right corner of Postman, select the environment you want to use

## Authentication

Most API endpoints require authentication. Here's how to authenticate:

1. Send a request to the "Login User" endpoint (in the Authentication folder)
2. Use valid email and password credentials in the request body
3. From the response, copy the token value
4. In Postman, click on the environment quick look (eye icon in the top right)
5. Set the "token" variable value to the token you copied
6. Now all requests that require authentication will include the token

## Testing Endpoints

The collection is organized into folders for each resource:

1. **Authentication** - Register, login, logout, and get user profile
2. **Products** - Create, read, update, and delete products
3. **Orders** - Create, read, and update orders

For endpoints that require parameters (like an ID), update the placeholder values in the URL or request body.

## Environment Variables

The collection uses two environment variables:

- `base_url`: The base URL of the API (e.g., `http://localhost:5000` for development)
- `token`: Your authentication token (set after login)

You can switch between environments (Development, Testing, Production) using the environment selector in the top right corner of Postman.

## Tips

1. After logging in, the token is typically valid for a limited time. If you get 401 Unauthorized errors, try logging in again to get a fresh token.
2. For admin-only endpoints, make sure to log in with an admin account.
3. When testing the Create Order endpoint, use valid product IDs from your database.
4. You can use the "Get Current User" endpoint to verify your authentication is working correctly. 