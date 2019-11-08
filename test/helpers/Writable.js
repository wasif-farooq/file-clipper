const stream = require('stream');
const { Writable } = stream;

class ObjectWritableMock extends Writable
{
    _write(data, cb) {
        cb();
    }
}

module.exports = ObjectWritableMock;
