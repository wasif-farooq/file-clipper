const stream = require('stream');
const { Transform } = stream;

class ObjectTransformMock extends Transform
{
    _transform(chunk, encoding, cb) {
        cb();
    }
}

module.exports = ObjectTransformMock;
