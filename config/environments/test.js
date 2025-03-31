module.exports = {
  env: 'test',
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/b2b-shoes-test',
  jwtSecret: process.env.JWT_SECRET || 'test-jwt-secret',
  jwtExpire: '24h',
  uploadDir: './public/uploads',
  logLevel: 'dev'
}; 