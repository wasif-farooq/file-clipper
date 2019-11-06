const crypto = require('crypto');
const fs = require('fs');
const zlib = require('zlib');
const getCipherKey = require('./key');
const ecp = require('event-callback-promise');


class Decryptor
{
    async getDecipher(file, secret, ecp) {
        // First, get the initialization vector from the file.
        const readInitVect = fs.createReadStream(file, { end: 15 });

        const onVectorData = ecp(readInitVect, 'data');
        const onVectorDataClose = ecp(readInitVect, 'close');

        const initVect = await onVectorData();
        await onVectorDataClose();

        const cipherKey = getCipherKey(secret);
        return crypto.createDecipheriv('aes256', cipherKey, initVect);
    }

    getUnZip() {
        return zlib.createUnzip();
    }

    async pipe(
        stream,
        source,
        destination,
        pipes,
        events
    ) {
        pipes.map(data => stream = stream.pipe(data))
        await events.onClose();
        await events.onRename(source, destination);
        return true;
    }

    async decrypt({ file, secret }) {

        const decipher = await this.getDecipher(file, secret, ecp);

        const readStream = fs.createReadStream(file, { start: 16 });
        const unzip = this.getUnZip();
        const writeStream = fs.createWriteStream(file + '.unenc');

        const onClose = ecp(writeStream, 'close');
        const rename = ecp(fs.rename);

        this.pipe(
            readStream,
            file + '.unenc',
            file,
            [
                decipher,
                unzip,
                writeStream
            ],
            {
                onClose: onClose,
                onRename: rename
            }
        );

        return true;

    }
}

module.exports = new Decryptor;
