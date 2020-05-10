const router = require('express').Router();
const checkAuth = require('../middleware/check-auth');
const Appointment = require('../models/appointment');

/**
 * @swagger
 * tags:
 *  name: Appointments
 *  description: Appointments endpoint
 */

/**
 * @swagger
 *
 * /api/appointments:
 *  get:
 *    tags: [Appointments]
 *    description: Get appointments
 *    responses:
 *      "200":
 *        description: OK
 *        content:
 *          application/json
 */
router.get('/', checkAuth, (req, res) => {
  Appointment.find({}, (err, appointments) => {
    if (err) {
      throw err;
    } else {
      res.send(appointments);
    }
  });
});

/**
 * @swagger
 *
 * /api/appointments/create:
 *  post:
 *    tags: [Appointments]
 *    description: Create Appointment
 *    parameters:
 *      - name: Appointment
 *        in: body
 *        required: true
 *        schema:
 *          $ref: '#/definitions/Appointment'
 *    responses:
 *      "200":
 *        description: Appointment created
 *        content:
 *          application/json
 */
router.post('/create', checkAuth, (req, res, next) => {
  console.log(req.body);
  const appointment = new Appointment(req.body);
  appointment.save((err, createdAppointment) => {
    if (err) {
      next(err);
    } else {
      res.status(200).send(createdAppointment);
    }
  });
});

/**
 * @swagger
 *
 * /api/appointments/{appointmentId}:
 *  delete:
 *    tags: [Appointments]
 *    description: Delete Appointment
 *    parameters:
 *      - name: appointmentId
 *        in: path
 *        required: true
 *    responses:
 *      "200":
 *        description: Appointment deleted
 *        content:
 *          application/json
 */
router.delete('/:id', checkAuth, (req, res, next) => {
  Appointment.deleteOne({ _id: req.params.id }, (err, deletedData) => {
    if (err) next(err);
    else {
      res.status(200).send(deletedData);
    }
  });
});

/**
 * @swagger
 *
 * /api/appointments/{appointmentId}/edit:
 *  put:
 *    tags: [Appointments]
 *    description: Update Appointment
 *    parameters:
 *      - name: appointmentId
 *        in: path
 *        required: true
 *      - name: Appointment
 *        in: body
 *        required: true
 *        schema:
 *          $ref: '#/definitions/Appointment'
 *    responses:
 *      "200":
 *        description: Appointment updated
 *        content:
 *          application/json
 */
router.put('/:id/edit', checkAuth, (req, res, next) => {
  Appointment.updateOne(
    { _id: req.params.id },
    req.body,
    (err, deletedData) => {
      if (err) next(err);
      else {
        res.status(200).send(deletedData);
      }
    },
  );
});

module.exports = router;
