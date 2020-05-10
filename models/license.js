const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 *  @swagger
 *
 *  definitions:
 *    License:
 *      type: object
 *      required:
 *        - data
 *      properties:
 *        data:
 *          type: string
 *
 *    LicenseCreate:
 *      type: object
 *      required:
 *        - licenseNumber
 *        - companyName
 *        - startDate
 *        - endDate
 *        - deviceCount
 *      properties:
 *        licenseNumber:
 *          type: string
 *        companyName:
 *          type: string
 *        startDate:
 *          type: string
 *        endDate:
 *          type: string
 *        deviceCount:
 *          type: number
 *
 *    LicenseUpdate:
 *      allOf:
 *       - $ref: '#/definitions/LicenseCreate'
 *       - properties:
 *          _id:
 *            type: string
 */
const licenseSchema = new Schema({
  data: { type: String, required: true },
});

module.exports = mongoose.model('license', licenseSchema);
