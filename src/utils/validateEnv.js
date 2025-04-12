/**
 * Validates required environment variables
 * Exits the process if any required variables are missing
 */
const validateEnv = () => {
  const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'NODE_ENV'
  ];

  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missingEnvVars.length > 0) {
    console.error('\x1b[31m%s\x1b[0m', 'Error: Missing required environment variables:');
    missingEnvVars.forEach(envVar => {
      console.error(`  - ${envVar}`);
    });
    console.error('\nPlease check your .env file and make sure all required variables are defined.');
    process.exit(1);
  }

  console.log('\x1b[32m%s\x1b[0m', 'Environment variables validated successfully');
};

module.exports = validateEnv;
