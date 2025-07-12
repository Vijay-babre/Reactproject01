const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Gemini Chat API',
    version: '1.0.0',
    description: 'API for Gemini Chat application with user authentication and chat functionality',
  },
  servers: [
    {
      url: 'https://gemini-backend-gox1.onrender.com/api',
      description: 'Development server',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;