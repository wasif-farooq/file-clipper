const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const Transform = require('./transform');
const getCipherKey = require('./key');
const ecp = require('event-callback-promise/src');


/**
 *
 * @param {*} param0
 */
async function encrypt({ file, secret }) {

    // Generate a secure, pseudo random initialization vector.
    const initVect = crypto.randomBytes(16);

    // Generate a cipher key from the password.
    const CIPHER_KEY = getCipherKey(secret);
    const readStream = fs.createReadStream(file);
    const gzip = zlib.createGzip();
    const cipher = crypto.createCipheriv('aes256', CIPHER_KEY, initVect);
    const transform = new Transform(initVect);
    // Create a write stream with a different file extension.
    const writeStream = fs.createWriteStream(path.join(file + '.enc'));

    readStream
        .pipe(gzip)
        .pipe(cipher)
        .pipe(transform)
        .pipe(writeStream);

    let onClose = ecp(readStream, 'close');
    let rename = ecp(fs.rename);

    await onClose();
    await rename(file + '.enc', file);
    return true;
}

module.exports = encrypt;
