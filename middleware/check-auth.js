const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).send('Unauthorized request');
    }
    const token = req.headers.authorization.split(' ')[1];
    if (token === 'null') {
      return res.status(401).send('Unauthorized request');
    }
    const decoded = jwt.verify(token, config.jwt.secret);
    req.userId = decoded.subject;
    next();
  } catch (err) {
    res.status(400);
    throw err;
  }
};
