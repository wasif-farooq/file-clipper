const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const Transform = require('./transform');
const getCipherKey = require('./key');

function encrypt({ file, secret }) {
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
        .pipe(writeStream)
        .on('close', () => {
            fs.rename(file + '.enc', file, (err) => {
                if (err) {
                    console.log(err);
                }
            });
        })
}

module.exports = encrypt;
