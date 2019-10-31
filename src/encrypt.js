const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const Transform = require('./transform');
const getCipherKey = require('./key');
const promisify = require('./promisify');


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

    let event = promisify(readStream.on);
    let rename = promisify(fs.rename);

    await event('close');
    await rename(file + '.enc', file);
    return true;
}

module.exports = encrypt;
