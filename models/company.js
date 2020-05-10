const mongoose = require('mongoose');
const License = require('./license');

const { Schema } = mongoose;

/**
 *  @swagger
 *
 *  definitions:
 *    Company:
 *      type: object
 *      required:
 *        - name
 *      properties:
 *        name:
 *          type: string
 *        address:
 *          type: string
 *        phone:
 *          type: string
 *        licenses:
 *          type: array
 *          items:
 *            $ref: '#/definitions/License'
 */
const companySchema = new Schema({
  name: { type: String, required: true },
  address: { type: String },
  phone: { type: String },
  licenses: { type: [License.schema], required: false },
});

module.exports = mongoose.model(
  'company',
  companySchema,
  'companies',
);
