const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const swaggerOptions = require('./config/swaggerDef');
const api = require('./routes/api');
const usersRoute = require('./routes/users');
const appointmentsRoute = require('./routes/appointments');
const logger = require('./helpers/logger');
const config = require('./config');

const app = express();

// swagger
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// Cors setup
const corsOptions = {
  credentials: true,
  origin(origin, callback) {
    const { whitelist } = config.cors;
    if (whitelist.includes('*')) {
      callback(null, true);
    } else if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// routes
app.use('/api', api);
app.use('/api/users', usersRoute);
app.use('/api/appointments', appointmentsRoute);

// Connect Database
const url = 'mongodb+srv://admin:Mnabcdef1!@cluster0-9cus0.mongodb.net/test?retryWrites=true&w=majority'
mongoose.connect(
  url,
  (err) => {
    if (err) {
      logger.error(`Error! ${err}`);
    } else {
      logger.info('Connected to mongodb');
    }
  },
);

// error handler
app.use((err, req, res, next) => {
  if (err) {
    res.json(err);
  }
  next();
});

app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.listen(process.env.PORT || 8000, () => {
  logger.info(`Server running on localhost: ${config.port}`);
});

