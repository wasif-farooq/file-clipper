const path = require('path');
const fs = require('fs');

function tiverse(link) {
    let list = [];
    if (!link) {
        return [];
    }

    let stat = fs.statSync(link);
    if (stat.isDirectory()) {
        let files = fs.readdirSync(link);
        files.forEach((file) => {
            file = path.join(link,  file);
            let stat = fs.statSync(file);
            if (stat.isDirectory()) {
                list = list.concat(tiverse(file));
            } else {
                list.push(path.resolve(file));
            }
        })
    } else {
        list.push(path.resolve(link));
    }

    return list;
}

module.exports = tiverse;