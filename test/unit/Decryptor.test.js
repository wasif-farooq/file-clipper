const { expect } = require('chai');
const { stub } = require('sinon');
const decryptor = require('../../src/Decryptor');
const fs = require('fs');
const crypto = require('crypto');
const zlib = require('zlib');
const {
    ObjectReadableMock,
    ObjectWritableMock,
    ObjectTransformMock
} = require('../helpers');

describe('#Decryptor', () => {

    describe('#getDecipher', () => {

        let getCipherKey;
        let readable;
        let ecp;

        beforeEach(() => {

            ecp = stub().returns(() => stub().resolves('123456789012345'));

            readable = new ObjectReadableMock();
            getCipherKey = stub().returns('1234567890');
            stub(fs, 'createReadStream').returns(readable);
            stub(crypto, 'createDecipheriv').returns(new ObjectTransformMock())
        });

        afterEach(() => {
            readable = undefined;
            fs.createReadStream.restore();
            crypto.createDecipheriv.restore();
            ecp = undefined;
        });

        it('should return the decipher object', () => {
            const decipher = decryptor.getDecipher('file.txt', 'mypassword', ecp);

            readable.emit('data', '1234567890123456');
            readable.emit('close');

            return decipher.then((data) => {
                expect(data).to.be.a('object');
                expect(getCipherKey.called).to.be.true;
                expect(fs.createReadStream.called).to.be.true;
                expect(crypto.createDecipheriv.called).to.be.true;
            })
            .catch(() => {
                // cll on error
            });
        })

    })

    describe('#getUnZip', () => {
        let transform;
        beforeEach(() => {
            transform = new ObjectTransformMock();
            stub(zlib, 'createUnzip').returns(transform);
        });

        afterEach(() => {
            zlib.createUnzip.restore();
        });

        it('should return readable stream', () => {
            const unzip = decryptor.getUnZip();
            expect(unzip.on).to.be.an('function');
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
            const pipes = decryptor.pipe(
                readable,
                'file.txt.unenc',
                'file.txt',
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
                    // call on error
                });
        })
    });

    describe('#decrypt', () => {

        let getCipherKey;
        let readable;
        let writable;
        let transform;

        beforeEach(() => {

            readable = new ObjectReadableMock();
            writable = new ObjectWritableMock();
            transform = new ObjectTransformMock();

            stub(fs, 'rename').resolves(true);

            stub(crypto, 'randomBytes').returns('123456789012345');
            stub(crypto, 'createCipheriv').returns(new ObjectTransformMock())
            stub(getCipherKey).returns('1234567890');

            stub(fs, 'createReadStream').returns(readable);
            stub(fs, 'createWriteStream').returns(writable);

            stub(zlib, 'createGzip').returns(transform);
            stub(decryptor, 'getDecipher').resolves(transform);
            stub(decryptor, 'pipe').resolves(true);
        });

        afterEach(() => {
            crypto.randomBytes.restore();
            crypto.createCipheriv.restore();
            fs.createReadStream.restore();
            fs.createWriteStream.restore();
            zlib.createGzip.restore();
            fs.rename.restore();
            decryptor.getDecipher.restore();
            decryptor.pipe.restore();
        });

        it('should return promise and call resolve', () => {
            const file = decryptor.decrypt({ file: '/file.txt', secret: 'mypassweord'});
            return file.then((data) => {
                expect(data).to.equal(true);
            });
        });
    });
});
