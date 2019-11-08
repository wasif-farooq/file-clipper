const { expect } = require('chai');
const { stub } = require('sinon');
const encryptor = require('../../src/Encryptor');
const fs = require('fs');
const crypto = require('crypto');
const zlib = require('zlib');
const {
    ObjectReadableMock,
    ObjectWritableMock,
    ObjectTransformMock
} = require('../helpers');

describe('#Encryptor', () => {

    describe('#getCipher', () => {

        let getCipherKey;

        beforeEach(() => {
            stub(getCipherKey).returns('1234567890');
            stub(crypto, 'randomBytes').returns('123456789012345');
            stub(crypto, 'createCipheriv').returns(new ObjectTransformMock())
        });

        afterEach(() => {
            crypto.randomBytes.restore();
            crypto.createCipheriv.restore();
        })

        it('should return the cipher object', () => {
            encryptor.getCipher('mypassword');
            expect(crypto.randomBytes.called).to.be.true;
            expect(crypto.createCipheriv.called).to.be.true;
        })
    })


    describe('#getZip', () => {

        beforeEach(() => {
            stub(zlib, 'createGzip').returns(new ObjectTransformMock())
        });

        afterEach(() => {
            zlib.createGzip.restore();
        })

        it('should call createGzip of zlib', () => {
            encryptor.getZip();
            expect(zlib.createGzip.called).to.be.true;
        });
    });

    describe('#getTransformation', () => {
        it('shbould not throw error if pass initvect', () => {
            const transform = encryptor.getTransformation('1234567890123456');
            expect(transform).to.not.equal('undefined');
        });

        it('shbould throw error if pass initvect', () => {
            expect(encryptor.getTransformation()).to.throw;
        });
    });

    describe('#pipe', () => {

        let readable;
        let writable;
        let transform;
        const events = {
            onClose: () => {
                // call on close
            },
            onRename: () => {
                // call on rename
            }
        };

        beforeEach(() => {
            stub(events, 'onClose').resolves(true);
            stub(events, 'onRename').resolves(true);

            readable = new ObjectReadableMock();
            writable = new ObjectWritableMock();
            transform = new ObjectTransformMock();

        });

        afterEach(() => {
            events.onClose.restore();
            events.onRename.restore();
            readable = writable = transform = undefined;
        });

        it('should return true', () => {
            const pipes = encryptor.pipe(
                readable,
                'file.txt',
                'file.txt.enc',
                [
                    transform,
                    writable
                ],
                events
            );

            readable.emit('data', 'this is a content');
            readable.emit('close');
            writable.emit('close');

            return pipes
            .then((data) => {
                expect(data).to.be.true;
            })
            .catch(() => {
                // on error
            });
        })

    });

    describe('#encrypt', () => {

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
            stub(encryptor, 'pipe').resolves(true);
        });

        afterEach(() => {
            crypto.randomBytes.restore();
            fs.createReadStream.restore();
            fs.createWriteStream.restore();
            zlib.createGzip.restore();
            fs.rename.restore();
            encryptor.pipe.restore();
        });

        it('should return promise and call resolve', () => {
            const file = encryptor.encrypt({ file: '/file.txt', secret: 'mypassweord'});
            return file.then((data) => {
                expect(data).to.equal(true);
            });
        });
    });
});
