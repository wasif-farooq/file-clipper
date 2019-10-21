const encrypt = require('./src/encrypt');
const decrypt = require('./src/decrypt');

const [ mode, file, secret ] = process.argv.slice(2);

console.log(mode, file, secret);
if (mode === 'encrypt') {
    encrypt({ file, secret });
}

if (mode === 'decrypt') {
    decrypt({ file, secret });
}
