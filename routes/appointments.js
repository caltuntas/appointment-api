const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");
const Appointment = require("../models/appointment");

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
 */
router.get("/", checkAuth, (req, res) => {
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
 * /api/appointments:
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
 */
router.post("/", checkAuth, (req, res, next) => {
  console.log(req.body);
  const appointment = new Appointment(req.body);
  const startDate = new Date(appointment.date);
  const endDate = new Date(appointment.date);
  const [startHours, startMinutes] = appointment.startTime.split(":");
  const [endHours, endMinutes] = appointment.endTime.split(":");
  startDate.setHours(startHours);
  startDate.setMinutes(startMinutes);
  endDate.setHours(endHours);
  endDate.setMinutes(endMinutes);
  appointment.startDate = startDate;
  appointment.endDate = endDate;
  appointment.createDate = new Date();
  Appointment.find({ 
      startDate: { $lte: startDate },
      endDate: { $gte: endDate },
      operator: appointment.operator,
    },
    (err, list) => {
      if (err) {
        next(err);
      } else {
        if (list && list.length > 0) {
          res
            .status(400)
            .send({ message: "there is an overlapping appointment" });
        } else {
          appointment.save((err, createdAppointment) => {
            if (err) {
              next(err);
            } else {
              res.status(200).send(createdAppointment);
            }
          });
        }
      }
    }
  );
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
 *        type: string
 *    responses:
 *      "200":
 *        description: Appointment deleted
 */
router.delete("/:id", checkAuth, (req, res, next) => {
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
 * /api/appointments:
 *  put:
 *    tags: [Appointments]
 *    description: Update Appointment
 *    parameters:
 *      - name: Appointment
 *        in: body
 *        required: true
 *        schema:
 *          $ref: '#/definitions/Appointment'
 *    responses:
 *      "200":
 *        description: Appointment updated
 */
router.put("/", checkAuth, (req, res, next) => {
  Appointment.updateOne({ _id: req.body.id }, req.body, (err, deletedData) => {
    if (err) next(err);
    else {
      res.status(200).send(deletedData);
    }
  });
});

module.exports = router;
