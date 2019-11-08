const expect  = require('chai').expect;
const getCipherKey = require('../../src/key');
const crypto = require('crypto');

describe('Encryption and Decryption key', () => {
    it('Check encryption key', () => {
        const key = crypto.createHash('sha256').update('test').digest();
        expect(getCipherKey('test').toString()).to.equal(key.toString());
    });
});
