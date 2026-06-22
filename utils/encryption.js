const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const encryptionKeyHex = process.env.ENCRYPTION_KEY;
if (!encryptionKeyHex) {
  throw new Error('ENCRYPTION_KEY is not set');
}

const key = Buffer.from(encryptionKeyHex, 'hex');
if (key.length !== 32) {
  throw new Error('ENCRYPTION_KEY must be a 64-character hex string');
}

const ivLength = 16;

exports.encrypt = (text) => {
  if (text === undefined || text === null || text === '') return text;

  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(text.toString(), 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return iv.toString('hex') + ':' + encrypted;
};

exports.decrypt = (text) => {
  if (text === undefined || text === null || text === '') return text;

  const [ivHex, encryptedText] = text.split(':');
  if (!ivHex || !encryptedText) {
    throw new Error('Invalid encrypted payload format');
  }
  const iv = Buffer.from(ivHex, 'hex');

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};
