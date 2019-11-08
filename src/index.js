const encrypt = require('./Encryptor').encrypt;
const decrypt = require('./Decryptor').decrypt;
const tiverse = require('./Tiverse');
const path = require('path');
const command = require('./command');


/**
 *
 */
class Clipper {

    /**
     *
     */
    constructor() {
        this.action = false;
        this.path = null;
        this.secret = null;
    }

    /**
     *
     */
    async getFiles() {
        return await tiverse.getFiles(await this.resolve(this.path))
    }

    /**
     *
     * @param {*} path
     * @return Promise
     */
    async resolve(file) {
        return path.resolve(file);
    }

    /**
     *
     * @param mode
     * @param path
     * @param secret
     * @return {Clipper}
     */
    static start({ mode, path, secret }) {
        let instance = new this;
        instance.path = path;
        instance.secret = secret;

        switch (mode) {
            case 'encrypt':
                instance.action = encrypt;
            break;
            case 'decrypt':
                instance.action = decrypt;
            break;
            default:
                instance.action = false;
        }

        instance.run();
        return instance;
    }

    /**
     *
     * @return {boolean}
     */
    run() {
        const { secret, action } = this;

        if (!action) {
            return false;
        }

        this.getFiles()
            .then((files) => Promise.all(files.map((file) => this.action({ file, secret }))))
            .then((data) => true)
            .catch((data) => false);
    }
}

Clipper.start(command.opts());
module.exports = Clipper;
