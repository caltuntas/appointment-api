const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 *  @swagger
 *
 *  definitions:
 *    UserLogin:
 *      type: object
 *      required:
 *        - username
 *        - password
 *      properties:
 *        username:
 *          type: string
 *        password:
 *          type: string
 *
 *    UserRegister:
 *      allOf:
 *       - $ref: '#/definitions/UserLogin'
 *       - required:
 *          - fullName
 *          - email
 *       - properties:
 *          fullName:
 *            type: string
 *          email:
 *            type: string
 */
const userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  gender: String,
  fullName: { type: String, required: true },
  mobileNumber: String,
});

module.exports = mongoose.model('user', userSchema, 'users');
