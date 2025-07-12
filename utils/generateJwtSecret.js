const crypto = require('crypto');

// Generate a 32-byte random string in hexadecimal format
const jwtSecret = crypto.randomBytes(32).toString('hex');

console.log('Generated JWT Secret Key:', jwtSecret);
console.log('Add this to your .env file as:');
console.log(`JWT_SECRET=${jwtSecret}`);