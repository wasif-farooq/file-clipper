const encryptor = require('./Encryptor');
const decryptor = require('./Decryptor');
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
        this.resolve = null;
        this.reject = null;
        this.isDone = new Promise((res, rej) => {
            this.resolve = res;
            this.reject = rej;
        });
    }

    /**
     *
     */
    async getFiles() {
        return await tiverse.getFiles(path.resolve(this.path))
    }

    /**
     *
     * @return {Promise<any>}
     */
    done() {
        return this.isDone;
    }

    /**
     *
     * @param mode
     * @param path
     * @param secret
     * @return {Clipper}
     */
    static start({ mode, path, secret }) {
        const instance = new this;
        instance.path = path;
        instance.secret = secret;

        switch (mode) {
            case 'encrypt':
                instance.action = encryptor.encrypt.bind(encryptor);
            break;
            case 'decrypt':
                instance.action = decryptor.decrypt.bind(decryptor);
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
            .then((data) => this.resolve(data))
            .catch((err) => this.reject(err));
    }
}

Clipper.start(command.opts());
module.exports = Clipper;
