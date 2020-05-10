const crypto = require('crypto');
// const Device = require('../../models/device');
const License = require('../models/license');

const SECRET_KEY =
  process.env.ENCRYPTION_KEY || '12345678912345678912345678912345';
const IV_LENGTH = 16;

function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(SECRET_KEY),
    iv,
  );
  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

function getDate(dateString) {
  const parts = dateString.split('.');
  const year = parseInt(parts[2], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[0], 10);
  const date = new Date(year, month, day);
  return date;
}

function formatDate(date) {
  const datePart = date.split('T')[0];
  const parts = datePart.split('-');
  const day = parseInt(parts[2], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[0], 10);
  return `${day}.${month}.${year}`;
}

function decrypt(text) {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(SECRET_KEY),
    iv,
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

function generate(data) {
  const localData = data;
  const text = JSON.stringify(localData);
  const hash = crypto
    .createHmac('sha1', SECRET_KEY)
    .update(text)
    .digest('hex');
  localData.key = hash;
  const textWithKey = JSON.stringify(data);
  const licenseKey = encrypt(textWithKey);
  return licenseKey;
}

function validateKey(licenseKey) {
  try {
    const text = decrypt(licenseKey);
    const data = JSON.parse(text);
    const { key } = data;
    delete data.key;
    const textWithoutKey = JSON.stringify(data);
    const hash = crypto
      .createHmac('sha1', SECRET_KEY)
      .update(textWithoutKey)
      .digest('hex');
    const currentTime = new Date().getTime();
    data.valid = key === hash;
    if (data.valid) {
      data.key = key;
      const expireTime = getDate(data.endDate).getTime();
      data.expired = currentTime > expireTime;
    }
    return data;
  } catch (e) {
    return {
      valid: false,
    };
  }
}

async function check(deviceCount) {
  //   const deviceCount = await Device.count({});
  const licenses = await License.find({}).lean();
  function isValid(l) {
    const license = validateKey(l.data);
    if (!license.valid) return false;
    const currentTime = new Date().getTime();
    const expireTime = new Date(license.expires).getTime();
    if (deviceCount > license.deviceNumber) return false;
    if (currentTime > expireTime) return false;
    return true;
  }
  const validLicenses = licenses.filter((l) => isValid(l));
  return validLicenses && validLicenses.length > 0;
}

async function decryptLicenses(licenses, deviceCount) {
  //   const deviceCount = await Device.countDocuments({});
  //   const licenses = await License.find({}).lean();

  const result = [];
  for (let index = 0; index < licenses.length; index += 1) {
    const l = licenses[index];
    const license = validateKey(l.data);
    license.limitExceeded = deviceCount > license.deviceCount;
    result.push(license);
  }
  return result;
}

function exclude(decryptedLicenses, fieldsToExclude) {
  decryptedLicenses.map((decryptedLicense) => {
    fieldsToExclude.split(' ').forEach((field) => {
      delete decryptedLicense[field];
    });
    return decryptedLicense;
  });
}

module.exports = {
  decryptLicenses,
  generate,
  validateKey,
  encrypt,
  decrypt,
  check,
  formatDate,
  exclude,
};
