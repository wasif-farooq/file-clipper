const crypto = require('crypto');
const fs = require('fs');
const zlib = require('zlib');
const getCipherKey = require('./key');
const ecp = require('event-callback-promise');

/**
 *
 */
class Decryptor
{
    /**
     *
     * @param file
     * @param secret
     * @param ecp
     * @returns {Promise<*>}
     */
    async getDecipher(file, secret, ecp) {
        // First, get the initialization vector from the file.
        this.readInitVect = fs.createReadStream(file, { end: 15 });

        const onVectorData = ecp(this.readInitVect, 'data');
        const onVectorDataClose = ecp(this.readInitVect, 'close');

        this.initVect = await onVectorData();
        await onVectorDataClose();

        this.cipherKey = getCipherKey(secret);
        return crypto.createDecipheriv('aes256', this.cipherKey, this.initVect);
    }

    /**
     *
     * @returns {*}
     */
    getUnZip() {
        this.unzip = zlib.createUnzip();
        return this.unzip;
    }

    /**
     *
     * @param stream
     * @param source
     * @param destination
     * @param pipes
     * @param events
     * @returns {Promise<boolean>}
     */
    async pipe(
        stream,
        source,
        destination,
        pipes,
        events
    ) {
        pipes.map(data => stream = stream.pipe(data))
        await events.onClose();
        this.renamed = await events.onRename(source, destination);
        return true;
    }

    /**
     *
     * @param file
     * @param secret
     * @returns {Promise<boolean>}
     */
    async decrypt({ file, secret }) {

        const decipher = await this.getDecipher(file, secret, ecp);

        const readStream = fs.createReadStream(file, { start: 16 });
        const unzip = this.getUnZip();
        const writeStream = fs.createWriteStream(file + '.unenc');

        const onClose = ecp(writeStream, 'close');
        const onRename = ecp(fs.rename);

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
                onClose,
                onRename
            }
        );

        return true;

    }
}

module.exports = new Decryptor;
