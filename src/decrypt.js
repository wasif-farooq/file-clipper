const crypto = require('crypto');
const fs = require('fs');
const zlib = require('zlib');
const getCipherKey = require('./key');
const ecp = require('event-callback-promise');

/**
 *
 * @param {*} param0
 */
async function decrypt({ file, secret }) {

    // First, get the initialization vector from the file.
    const readInitVect = fs.createReadStream(file, { end: 15 });

    const onVectorData = ecp(readInitVect, 'data');
    const onVectorDClose = ecp(readInitVect, 'close');

    const initVect = await onVectorData();
    await onVectorDClose();

    const cipherKey = getCipherKey(secret);
    const readStream = fs.createReadStream(file, { start: 16 });
    const decipher = crypto.createDecipheriv('aes256', cipherKey, initVect);
    const unzip = zlib.createUnzip();
    const writeStream = fs.createWriteStream(file + '.unenc');

    readStream
        .pipe(decipher)
        .pipe(unzip)
        .pipe(writeStream);

    const onClose = ecp(readStream, 'close');
    const rename = ecp(fs.rename);

    await onClose();
    await rename(file + '.unenc', file);
    return true;
}

module.exports = decrypt;
