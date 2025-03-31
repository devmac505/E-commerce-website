require('dotenv').config();

// Determine which environment to use
const env = process.env.NODE_ENV || 'development';

// Load the correct environment file
const config = require(`./environments/${env}`);

module.exports = config; 