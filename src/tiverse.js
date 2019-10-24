const path = require('path');
const fs = require('fs');

function checkPermission(path) {
    try {
        fs.accessSync(path, fs.constants.W_OK);
    } catch (e) {
        console.log('Please allow write permissions to this path : ', path);
        process.exit();
    }
}

async function tiverse(link) {
    let list = [];
    return new Promise((resolve, reject) => {
        if (!link) {
            reject('the path is empty');
        }

        if (!await fs.exists(link)) {
            reject('Path not exists :', link);
        }


    });

    if (!fs.existsSync(link)) {
        throw new Error('Path not exists : ', link);
    }

    checkPermission(link);

    let stat = fs.statSync(link);
    if (stat.isDirectory()) {
        let files = fs.readdirSync(link);
        files.forEach((file) => {
            file = path.join(link,  file);
            let stat = fs.statSync(file);
            if (stat.isDirectory()) {
                list = list.concat(tiverse(file));
            } else {
                checkPermission(file);
                list.push(path.resolve(file));
            }
        })
    } else {
        list.push(path.resolve(link));
    }

    return list;
}

module.exports = tiverse;
