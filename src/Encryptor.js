const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const Transform = require('./transform');
const getCipherKey = require('./key');
const ecp = require('event-callback-promise');

/**
 *
 */
class Encrypter
{
    /**
     *
     * @param secret
     * @returns {*}
     */
    getCipher(secret) {
        // Generate a secure, pseudo random initialization vector.
        this.initVect = crypto.randomBytes(16);

        // Generate a cipher key from the password.
        const CIPHER_KEY = getCipherKey(secret);

        return crypto.createCipheriv('aes256', CIPHER_KEY, this.initVect);
    }

    /**
     *
     * @returns {*}
     */
    getZip() {
        this.zip = zlib.createGzip();
        return this.zip;
    }

    /**
     *
     * @param initVect
     * @returns {FileClipperTransform}
     */
    getTransformation(initVect) {
        this.transform = new Transform(initVect)
        return this.transform;
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
    async encrypt({ file, secret }) {

        const cipher = this.getCipher(secret);
        const readStream = fs.createReadStream(file);
        const gzip = this.getZip();
        const transform = this.getTransformation(this.initVect);
        // Create a write stream with a different file extension.
        const writeStream = fs.createWriteStream(path.join(file + '.enc'));

        const onClose = ecp(writeStream, 'close');
        const onRename = ecp(fs.rename);

        return await this.pipe(
            readStream,
            file + '.enc',
            file,
            [
                gzip,
                cipher,
                transform,
                writeStream
            ],
            {
                onClose,
                onRename
            }
        );
    }
}

module.exports = new Encrypter;
