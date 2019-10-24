const program = require('commander');
const { version } = require('../package.json');
program
    .version(version)
    .option('-m, --mode <mode>', 'encrypt/decrypt the filea or folders', '')
    .option('-p, --path <path>', 'path of a file or directory', '')
    .option('-s, --secret <secret>', 'secrect or salt to handle encryption', '')
    .parse(process.argv);

module.exports = program;