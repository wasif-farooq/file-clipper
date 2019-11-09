const stream = require('stream');
const { Readable } = stream;

class ObjectReadableMock extends Readable
{
    _read(size) {
        this.data = size;
        return '';
    }
}

module.exports = ObjectReadableMock;
