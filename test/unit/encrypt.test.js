const { expect } = require('chai');
const { stub } = require('sinon');
const encrypt = require('../../src/encrypt');
const fs = require('fs');
const crypto = require('crypto');
const zlib = require('zlib');
const mock = require('mock-fs');
const { ObjectReadableMock, ObjectWritableMock, ObjectTransformMock } = require('../helpers');

console.log(ObjectReadableMock);
describe('#Encrypt', function() {

    let getCipherKey;
    let readable;
    let writable;
    let transform;
    let Transform;

    beforeEach(() => {

        readable = new ObjectReadableMock();
        writable = new ObjectWritableMock();
        transform = new ObjectTransformMock();
        Transform = ObjectTransformMock;

        stub(fs, 'rename').resolves(true);

        stub(crypto, 'randomBytes').returns('123456789012345');
        stub(crypto, 'createCipheriv').returns(new ObjectTransformMock())
        stub(getCipherKey).returns('1234567890');

        stub(fs, 'createReadStream').returns(readable);
        stub(fs, 'createWriteStream').returns(writable);

        stub(zlib, 'createGzip').returns(transform);
    });

    afterEach(() => {
        crypto.randomBytes.restore();
        fs.createReadStream.restore();
        fs.createWriteStream.restore();
        zlib.createGzip.restore();
        fs.rename.restore();
    })


    it('should return promise and call resolve', function() {

        let file = encrypt({ file: '/file.txt', secret: 'mypassweord'});

        readable.emit('data', 'hello');
        readable.emit('close');
        writable.emit('close');

        return file
            .then((data) => {
                expect(data).to.equal(true);
            })
    });
/*
    it('should return promise and call reject', function(done) {

        fs.rename = stub().callsArgWithAsync(
            2, 'premission error'
          );

        let file = encrypt({ file: '/not-prem-file.txt', secret: 'mypassweord'});
        file.then((data) => {
            //expect(data).to.equal(true);
        }).catch((err) => {
            expect(err).to.not.be.null;
            done()
        });
    });
*/
});
