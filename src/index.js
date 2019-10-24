const encrypt = require('./encrypt');
const decrypt = require('./decrypt');
const getFiles = require('./tiverse');
const resolve = require('path').resolve;
const command = require('./command');

class Clipper {
    constructor() {
        this.action = false;
        this.path = null;
        this.secrect = null;
    }

    asycn getFiles() {
        return await getFiles(await this.resolve(this.path))
    }

    async resolve(path) {
        return resolve(path);
    }

    static start({ mode, path, secret }) {
        this.path = path;
        this.secret = secret;

        this.action = mode === 'encrypt' ? encrypt: false;
        this.action = mode === 'decrypt' ? decrypt: false;
        this.run();
    }

    run() {
        const { secrect, action } = this;

        if (!action) {
            return false;
        }

        return this.getFiles()
            .then((files) => files.map((file) => action({ file, secrect })))
            .catch(console.log);
    }
}

Clipper.start(command.opts());
