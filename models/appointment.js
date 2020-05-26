const mongoose = require("mongoose");

const { Schema } = mongoose;

/**
 *  @swagger
 *
 *  definitions:
 *    Appointment:
 *      type: object
 *      required:
 *        - name
 *      properties:
 *        name:
 *          type: string
 *        phone:
 *          type: string
 *        date:
 *          type: string
 *        startTime:
 *          type: string
 *        endTime:
 *          type: string
 *        description:
 *          type: string
 *        operator:
 *          type: string
 */
const appointmentSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String },
  date: { type: String },
  startTime: { type: String },
  endTime: { type: String },
  description: { type: String },
  operator: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "User" 
  },
});

module.exports = mongoose.model(
  "appointment",
  appointmentSchema,
  "appointments"
);
