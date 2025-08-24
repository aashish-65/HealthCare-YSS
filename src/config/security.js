const crypto = require('crypto');

const key = Buffer.from(process.env.DATA_ENC_KEY_BASE64 || '', 'base64'); // 32 bytes

function encryptJSON(obj) {
  if (!key.length) return JSON.stringify(obj); // fallback (dev only)
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const plaintext = Buffer.from(JSON.stringify(obj));
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, ciphertext]).toString('base64');
}

function decryptJSON(b64) {
  if (!key.length) return JSON.parse(b64);
  const raw = Buffer.from(b64, 'base64');
  const iv = raw.subarray(0,12);
  const tag = raw.subarray(12,28);
  const ciphertext = raw.subarray(28);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return JSON.parse(plaintext.toString('utf8'));
}

module.exports = { encryptJSON, decryptJSON };
