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
 *    CreateUser:
 *      type: object
 *      required:
 *        - fullName
 *        - username
 *        - password
 *      properties:
 *        fullName:
 *          type: string
 *        username:
 *          type: string
 *        password:
 *          type: string
 *        role:
 *          type: string
 */
const userSchema = new Schema({
  fullName: { type: String, required: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  email: String,
  mobileNumber: String,
});

module.exports = mongoose.model('user', userSchema, 'users');
