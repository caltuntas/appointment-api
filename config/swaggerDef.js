const swaggerDefinition = {
  info: {
    title: 'Sechard Licensing API',
    version: '1.0.0',
    description: 'Sechard Licensing API',
  },
  basePath: '/',
  servers: ['http://localhost:8000/api'],
  securityDefinitions: {
    JWT: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
    },
  },
  security: [
    {
      JWT: [],
    },
  ],
};

const swaggerOptions = {
  swaggerDefinition,
  apis: ['./routes/*.js', './models/*.js'],
};

module.exports = swaggerOptions;
