const router = require('express').Router();
const checkAuth = require('../middleware/check-auth');
const License = require('../models/license');
const Company = require('../models/company');
const licenseManager = require('../services/license-manager');

/**
 * @swagger
 * tags:
 *  name: Licenses
 *  description: Licenses endpoint
 */

/**
 * @swagger
 *
 * /api/licenses/{companyId}:
 *  get:
 *    tags: [Licenses]
 *    description: Get company licenses
 *    parameters:
 *      - name: companyId
 *        in: path
 *        required: true
 *    responses:
 *      "200":
 *        description: OK
 *        content:
 *          application/json
 */
router.get('/:companyId', checkAuth, (req, res, next) => {
  const query = Company.findById(req.params.companyId)
    .select('name address licenses')
    .lean();
  query.exec({}, async (err, company) => {
    if (err) {
      next(err);
    } else {
      const localCompany = company;
      if (localCompany.licenses) {
        // TODO: get deviceCount from company.deviceCount (FIX)
        const deviceCount = 25;
        const decryptedLicenses = await licenseManager.decryptLicenses(
          localCompany.licenses,
          deviceCount,
        );

        const fields = 'expired limitExceeded companyName';
        licenseManager.exclude(decryptedLicenses, fields);

        const mergedLicenses = localCompany.licenses.map(
          (item, index) => ({ ...item, ...decryptedLicenses[index] }),
        );
        localCompany.licenses = [...mergedLicenses];
        res.status(200).send(localCompany);
      }
    }
  });
});


/**
 * @swagger
 *
 * /api/licenses/create/{companyId}:
 *  post:
 *    tags: [Licenses]
 *    description: Create License for Company
 *    parameters:
 *      - name: companyId
 *        in: path
 *        required: true
 *      - name: License
 *        in: body
 *        required: true
 *        schema:
 *          $ref: '#/definitions/LicenseCreate'
 *    responses:
 *      "200":
 *        description: License created
 *        content:
 *          application/json
 */
router.post('/create/:companyId', checkAuth, (req, res, next) => {
  const companyQuery = Company.findById(req.params.companyId);
  companyQuery.exec({}, (err, company) => {
    if (err) {
      next(err);
    } else {
      req.body.startDate = licenseManager.formatDate(
        req.body.startDate,
      );
      req.body.endDate = licenseManager.formatDate(req.body.endDate);

      const data = licenseManager.generate(req.body);
      const license = new License({ data });
      company.licenses.push(license);
      company.save(async (_err, _company) => {
        if (_err) {
          next(_err);
        } else {
          const createdLicense = _company.licenses
            .filter((licence) => licence.data === data)[0]
            .toObject();
          // TODO: get deviceCount from company.deviceCount (FIX)
          const deviceCount = 25;
          const parsedLicenses = await licenseManager.decryptLicenses(
            [createdLicense],
            deviceCount,
          );
          Object.assign(createdLicense, parsedLicenses[0]);
          res.status(200).send(createdLicense);
        }
      });
    }
  });
});


/**
 * @swagger
 *
 * /api/licenses/{companyId}/{licenseId}:
 *  delete:
 *    tags: [Licenses]
 *    description: Delete Company License
 *    parameters:
 *      - name: companyId
 *        in: path
 *        required: true
 *      - name: licenseId
 *        in: path
 *        required: true
 *    responses:
 *      "200":
 *        description: License deleted
 *        content:
 *          application/json
 */
router.delete(
  '/:companyId/:licenseId',
  checkAuth,
  (req, res, next) => {
    const query = Company.updateOne(
      { _id: req.params.companyId },
      { $pull: { licenses: { _id: req.params.licenseId } } },
    );
    query.exec({}, (err, resp) => {
      if (err) {
        next(err);
      } else {
        res.send(resp);
      }
    });
  },
);


/**
 * @swagger
 *
 * /api/licenses/{companyId}/edit:
 *  put:
 *    tags: [Licenses]
 *    description: Update Company License
 *    parameters:
 *      - name: companyId
 *        in: path
 *        required: true
 *      - name: LicenseUpdate
 *        in: body
 *        required: true
 *        schema:
 *          $ref: '#/definitions/LicenseUpdate'
 *    responses:
 *      "200":
 *        description: Company License updated
 *        content:
 *          application/json
 */
router.put('/:companyId/edit', checkAuth, (req, res, next) => {
  const query = Company.findById(req.params.companyId);
  query.exec({}, async (err, company) => {
    if (err) {
      next(err);
    } else {
      const dbLicense = company.licenses.id(req.body._id);
      delete req.body._id;

      req.body.startDate = licenseManager.formatDate(
        req.body.startDate,
      );
      req.body.endDate = licenseManager.formatDate(req.body.endDate);

      const data = licenseManager.generate(req.body);
      const license = new License({ data });

      dbLicense.data = license.data;
      company.save(async (_err, _company) => {
        if (_err) {
          next(_err);
        } else {
          const updatedLicense = _company.licenses
            .filter((licence) => licence.data === data)[0]
            .toObject();
          // TODO: get deviceCount from company.deviceCount (FIX)
          const deviceCount = 25;
          const parsedLicenses = await licenseManager.decryptLicenses(
            [updatedLicense],
            deviceCount,
          );
          Object.assign(updatedLicense, parsedLicenses[0]);
          res.status(200).send(updatedLicense);
        }
      });
    }
  });
});

module.exports = router;
