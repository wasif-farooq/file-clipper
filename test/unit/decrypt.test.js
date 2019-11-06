const { expect } = require('chai');
const { stub } = require('sinon');
const decryptor = require('../../src/decrypt');
const fs = require('fs');
const crypto = require('crypto');
const zlib = require('zlib');
const { 
    ObjectReadableMock,
    ObjectWritableMock,
    ObjectTransformMock
} = require('../helpers');

describe('#Decryptor', function() {

    describe('#getDecipher', function() {

        let getCipherKey;
        let readable;

        beforeEach(() => {
            readable = new ObjectReadableMock();
            getCipherKey = stub().returns('1234567890');
            stub(fs, 'createReadStream').returns(readable);
            stub(crypto, 'createDecipheriv').returns(new ObjectTransformMock())
        });

        afterEach(() => {
            readable = undefined;
            fs.createReadStream.restore();
            crypto.createDecipheriv.restore();
        });

        it('should return the decipher object', function() {
            let decipher = decryptor.getDecipher('file.txt', 'mypassword');
            
            readable.emit('data', '1234567890123456');
            readable.emit('close');

            return decipher.then((data) => {
                expect(data).to.be.a('object');
                expect(getCipherKey.called).to.be.true;
                expect(fs.createReadStream.called).to.be.true;
                expect(crypto.createDecipheriv.called).to.be.true;
            })
            .catch(() => {});
        })

    })

});