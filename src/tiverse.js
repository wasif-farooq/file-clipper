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
    constructor(link) {
        this.link = link;
        this.list = [];
    }

    /**
     *
     */
    async start() {
        try {
            await this.access();
            let stats = await this.stats();

            if (stats.isDirectory()) {
                this.list = this.list.concat(await this.iterate());
            } else {
                this.list.push(this.link);
            }

            return this.reduce(this.list);

        } catch (err) {
            throw err;
        }
    }

    access() {
        new Promise((resolve, reject) => {
            fs.access(this.link, fs.constants.W_OK, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(true);
            });
        });
    }

    /**
     *
     * @param {*} err
     */
    stats() {
        return new Promise((resolve, reject) => {
            fs.stat(this.link, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(data);
            });
        });
    }

    /**
     *
     * @param {*} err
     * @param {*} files
     */
    iterate() {
        return new Promise((resolve, reject) => {
            fs.readdir(this.link, (err, files) => {

                if (err) {
                    reject(err);
                    return err;
                }

                Promise.all(
                    files.map((file) => {
                        file = path.join(this.link, file);
                        return Tiverse.getFiles(file);
                    })
                )
                .then(resolve)
                .catch(reject);

            });
        });
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
        let instance = new Tiverse(link);
        return instance.start();
    }
}

module.exports = Tiverse;
