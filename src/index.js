const encrypt = require('./encrypt').encrypt;
const decrypt = require('./decrypt');
const { getFiles } = require('./tiverse');
const resolve = require('path').resolve;
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
        return await getFiles(await this.resolve(this.path))
    }

    /**
     *
     * @param {*} path
     */
    async resolve(path) {
        return resolve(path);
    }

    /**
     *
     * @param {*} param0
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
    }

    /**
     *
     */
    run() {
        const { secret, action } = this;

        if (!action) {
            return false;
        }

        let time = Date.now();
        this.getFiles()
            .then((files) => Promise.all(files.map((file) => this.action({ file, secret }))))
            .then((data) => console.log("data :", data, Date.now() - time))
            .catch((data) => console.log("data : ", data));
    }
}

Clipper.start(command.opts());
