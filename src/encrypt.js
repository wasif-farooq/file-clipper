const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const Transform = require('./transform');
const getCipherKey = require('./key');
const ecp = require('event-callback-promise');

class Encrypter
{
    getCipher(secret) {
        // Generate a secure, pseudo random initialization vector.
        this.initVect = crypto.randomBytes(16);

        // Generate a cipher key from the password.
        const CIPHER_KEY = getCipherKey(secret);

        return crypto.createCipheriv('aes256', CIPHER_KEY, this.initVect);
    }

    getZip() {
        return zlib.createGzip()
    }

    getTransformation(initVect) {
        new Transform(initVect)
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

    async encrypt({ file, secret }) {
    
        const cipher = this.getCipher(secret);
        const readStream = fs.createReadStream(file);
        const gzip = this.getZip();
        const transform = this.getTransformation(this.initVect);
        // Create a write stream with a different file extension.
        const writeStream = fs.createWriteStream(path.join(file + '.enc'));
    
        let close = ecp(writeStream, 'close');
        let rename = ecp(fs.rename);
    
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
                onClose: close,
                onRename: rename
            }
        );
    }
}

module.exports = new Encrypter;
