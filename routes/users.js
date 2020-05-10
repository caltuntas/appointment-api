const router = require('express').Router();
const bcyrpt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const logger = require('../helpers/logger');
const checkAuth = require('../middleware/check-auth');
const config = require('../config');

/**
 * @swagger
 * tags:
 *  name: Users
 *  description: User endpoint
 */

/**
 * @swagger
 *
 * /api/users:
 *  get:
 *    tags: [Users]
 *    description: User endpoint
 *    responses:
 *      "200":
 *        description: User endpoint
 */
router.get('/', checkAuth, (req, res) => {
  res.send({ name: 'users route get' });
});

/**
 * @swagger
 *
 * /api/users/register:
 *  post:
 *    tags: [Users]
 *    description: Register User
 *    parameters:
 *      - name: 'UserRegister'
 *        in: body
 *        required: true
 *        schema:
 *          $ref: '#/definitions/UserRegister'
 *    responses:
 *      "200":
 *        description: User created
 */
router.post('/register', (req, res) => {
  const userData = req.body;
  bcyrpt.hash(
    userData.password,
    config.jwt.saltRounds,
    (hashErr, hash) => {
      userData.password = hash;
      const user = new User(userData);
      user.save((registerErr, registeredUser) => {
        if (registerErr) {
          logger.error(registerErr);
        } else {
          res.status(200).send(registeredUser);
        }
      });
    },
  );
});

/**
 * @swagger
 *
 * /api/users/login:
 *  post:
 *    tags: [Users]
 *    description: Login User
 *    parameters:
 *      - name: 'UserLogin'
 *        in: body
 *        required: true
 *        schema:
 *          $ref: '#/definitions/UserLogin'
 *    responses:
 *      "200":
 *        description: Logged in successfully
 */
router.post('/login', (req, res) => {
  const userData = req.body;
  User.findOne({ username: userData.username }, (err, user) => {
    if (err) {
      logger.error(err);
    } else if (!user) {
      res.status(401).send('invalid username');
    } else {
      bcyrpt.compare(
        userData.password,
        user.password,
        (_err, result) => {
          if (!result) {
            res.status(401).send('invalid password');
          } else {
            const payload = {
              subject: user.id,
            };
            const token = jwt.sign(payload, config.jwt.secret);
            res.status(200).send({
              token,
              fullName: user.fullName,
              email: user.email,
            });
          }
        },
      );
    }
  }).lean();
});

module.exports = router;
