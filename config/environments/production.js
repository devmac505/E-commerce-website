module.exports = {
  env: 'production',
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI_PROD,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: '7d',
  uploadDir: './public/uploads',
  logLevel: 'combined'
}; 