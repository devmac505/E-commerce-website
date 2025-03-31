module.exports = {
  env: 'development',
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI_DEV || 'mongodb://localhost:27017/b2b-shoes-dev',
  jwtSecret: process.env.JWT_SECRET || 'dev-jwt-secret',
  jwtExpire: '24h',
  uploadDir: './public/uploads',
  logLevel: 'dev'
}; 