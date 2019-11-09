const path = require('path');
const fs = require('fs');
const ecp = require('event-callback-promise');

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
        Object.assign(this, fs);
        this.access = ecp(this.access);
        this.stat = ecp(this.stat);
        this.readdir = ecp(this.readdir);

        this.link = link;
        this.list = [];
    }

    /**
     *
     * @return {Promise<*>}
     */
    async start() {
        await this.access(this.link, this.constants.W_OK);
        const stats = await this.stat(this.link);

        if (stats.isDirectory()) {
            this.list = this.list.concat(await this.iterate());
        } else {
            this.list.push(this.link);
        }

        return await this.reduce(this.list);
    }

    /**
     *
     * @return {Promise<any[]>}
     */
    async iterate() {
        const files = await this.readdir(this.link);
        return Promise.all(
            files.map((file) => {
                file = path.join(this.link, file);
                return Tiverse.getFiles(file);
            })
        );
    }

    /**
     *
     * @param data
     * @return {Promise<Array>}
     */
    async reduce(data) {
        let list = [];
        for (const i in data) {
            if (Array.isArray(data[i])) {
                list = list.concat(await this.reduce(data[i]));
            } else {
                list.push(data[i]);
            }
        }

        return list;
    }

    /**
     *
     * @param link
     * @return {Promise<*>}
     */
    static async getFiles(link) {
        const instance = new Tiverse(link);
        return instance.start();
    }
}

module.exports = Tiverse;
