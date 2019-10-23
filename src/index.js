const program = require('commander');
const encrypt = require('./encrypt');
const decrypt = require('./decrypt');
const getFiles = require('./tiverse');
const paths = require('path');
const { version } = require('../package.json');

program
    .version(version)
    .option('-m, --mode <mode>', 'encrypt/decrypt the filea or folders', '')
    .option('-p, --path <path>', 'path of a file or directory', '')
    .option('-s, --secret <secret>', 'secrect or salt to handle encryption', '')
    .parse(process.argv);


const { mode, path, secret } = program.opts();
const files = getFiles(paths.resolve(path));


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
;