const path = require('path');
const fs = require('fs');

/**
 *
 */
class Tiverse {

    /**
     *
     * @param {*} link
     * @param {*} resolve
     * @param {*} reject
     */
    constructor(link, resolve, reject) {
        this.link = link;
        this.resolve = resolve;
        this.reject = reject;
        this.list = [];
    }

    /**
     *
     */
    start() {
        fs.access(this.link, fs.constants.W_OK, this.stats.bind(this));
    }

    /**
     *
     * @param {*} err
     */
    stats(err) {
        if (err) {
            this.reject(err);
            return err;
        }

        fs.stat(this.link, this.read.bind(this));
    }

    /**
     *
     * @param {*} err
     * @param {*} data
     */
    read(err, data) {

        if (err) {
            this.reject(err);
            return;
        }

        if (data.isDirectory()) {
            fs.readdir(this.link, this.iterate.bind(this));
        } else {
            this.resolve([this.link]);
        }
    }

    /**
     *
     * @param {*} err
     * @param {*} files
     */
    iterate(err, files) {

        if (err) {
            this.reject(err);
            return;
        }

        Promise.all(
            files.map((file) => {
                file = path.join(this.link, file);
                return Tiverse.getFiles(file);
            })
        )
        .then((data) => this.resolve(this.reduce(data)))
        .catch(this.reject);
    }

    /**
     *
     * @param {*} data
     */
    reduce(data) {
        let list = [];
        data.forEach((item) => {
            if (Array.isArray(item)) {
                list = list.concat(this.reduce(item));
            } else {
                list.push(item);
            }
        });
        return list;
    }

    /**
     *
     * @param {*} link
     */
    static async getFiles(link) {
        return new Promise((resolve, reject) => {
            let instance = new Tiverse(link, resolve, reject);
            instance.start();
        })
    }
}

module.exports = Tiverse;
