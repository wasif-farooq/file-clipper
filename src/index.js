const encrypt = require('./encrypt');
const decrypt = require('./decrypt');
const getFiles = require('./tiverse');
const resolve = require('path').resolve;

const command = require('./command');

class Clipper {
    constructor() {
        
    }
}



const { mode, path, secret } = command.opts();
const files = getFiles(resolve(path));

let  action = false;
action = mode === 'encrypt' ? encrypt: false;
action = mode === 'decrypt' ? decrypt: false;

if (action) {
    files.map((file) => {
        action({ file, secret });
    })
}
