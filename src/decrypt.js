const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const getCipherKey = require('./key');

function decrypt({ file, secret }) {
    // First, get the initialization vector from the file.
    const readInitVect = fs.createReadStream(file, { end: 15 });

    let initVect;
    readInitVect.on('data', (chunk) => {
        initVect = chunk;
    });

    // Once we’ve got the initialization vector, we can decrypt the file.
    readInitVect.on('close', () => {
        const cipherKey = getCipherKey(secret);
        const readStream = fs.createReadStream(file, { start: 16 });
        const decipher = crypto.createDecipheriv('aes256', cipherKey, initVect);
        const unzip = zlib.createUnzip();
        const writeStream = fs.createWriteStream(file + '.unenc ');

        readStream
            .pipe(decipher)
            .pipe(unzip)
            .pipe(writeStream)
            .on('close', () => {
                fs.rename(file + '.unenc', file, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            })
    });
}

module.exports = decrypt;
