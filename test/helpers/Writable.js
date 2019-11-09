const stream = require('stream');
const { Writable } = stream;

class ObjectWritableMock extends Writable
{
    _write(data, cb) {
        this.data += data;
        cb();
    }
}

module.exports = ObjectWritableMock;
