const encrypt = require('./src/encrypt');
const decrypt = require('./src/decrypt');
const getFiles = require('./src/tiverse');
const path = require('path');

const [ mode, file, secret ] = process.argv.slice(2);

const files = getFiles(path.resolve(file));

if (mode === 'encrypt') {
    files.map((file) => {
        encrypt({ file, secret });
    })
}

if (mode === 'decrypt') {
    files.map((file) => {
        decrypt({ file, secret });
    });
}
