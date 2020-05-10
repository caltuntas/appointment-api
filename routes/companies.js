const router = require('express').Router();
const checkAuth = require('../middleware/check-auth');
const Company = require('../models/company');

/**
 * @swagger
 * tags:
 *  name: Companies
 *  description: Companies endpoint
 */

/**
 * @swagger
 *
 * /api/companies:
 *  get:
 *    tags: [Companies]
 *    description: Get companies
 *    responses:
 *      "200":
 *        description: OK
 *        content:
 *          application/json
 */
router.get('/', checkAuth, (req, res) => {
  Company.find({}, (err, companies) => {
    if (err) {
      throw err;
    } else {
      res.send(companies);
    }
  }).select('-licenses');
});

/**
 * @swagger
 *
 * /api/companies/create:
 *  post:
 *    tags: [Companies]
 *    description: Create Company
 *    parameters:
 *      - name: Company
 *        in: body
 *        required: true
 *        schema:
 *          $ref: '#/definitions/Company'
 *    responses:
 *      "200":
 *        description: Company created
 *        content:
 *          application/json
 */
router.post('/create', checkAuth, (req, res, next) => {
  console.log(req.body);
  const companyData = new Company(req.body);
  companyData.save((err, createdCompany) => {
    if (err) {
      next(err);
    } else {
      res.status(200).send(createdCompany);
    }
  });
});

/**
 * @swagger
 *
 * /api/companies/{companyId}:
 *  delete:
 *    tags: [Companies]
 *    description: Delete Company
 *    parameters:
 *      - name: companyId
 *        in: path
 *        required: true
 *    responses:
 *      "200":
 *        description: Company deleted
 *        content:
 *          application/json
 */
router.delete('/:id', checkAuth, (req, res, next) => {
  Company.deleteOne({ _id: req.params.id }, (err, deletedData) => {
    if (err) next(err);
    else {
      res.status(200).send(deletedData);
    }
  });
});

/**
 * @swagger
 *
 * /api/companies/{companyId}/edit:
 *  put:
 *    tags: [Companies]
 *    description: Update Company
 *    parameters:
 *      - name: companyId
 *        in: path
 *        required: true
 *      - name: Company
 *        in: body
 *        required: true
 *        schema:
 *          $ref: '#/definitions/Company'
 *    responses:
 *      "200":
 *        description: Company updated
 *        content:
 *          application/json
 */
router.put('/:id/edit', checkAuth, (req, res, next) => {
  Company.updateOne(
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
