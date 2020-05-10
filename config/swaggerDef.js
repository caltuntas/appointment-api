const swaggerDefinition = {
  info: {
    title: 'Appointment API',
    version: '1.0.0',
    description: 'Appointment API',
  },
  basePath: '/',
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
