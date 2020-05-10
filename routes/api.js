const router = require('express').Router();

/**
 * @swagger
 * tags:
 *  name: Test
 *  description: Test API
 */

/**
 * @swagger
 *
 * /api:
 *  get:
 *    tags: [Test]
 *    description: API Test
 *    responses:
 *      "200":
 *        description: API Test
 */
router.get('/', (req, res) => {
  res
    .status(200)
    .send({ result: 'Appointment API is working' });
});

module.exports = router;
