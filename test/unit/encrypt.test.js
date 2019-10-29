const { expect } = require('chai');
const sinon = require('sinon');
const { stub, fake, spy } = sinon;
const encrypt = require('../../src/encrypt');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const zlib = require('zlib');
const mock = require('mock-fs');


describe('#Encrypt', function() {

    beforeEach(() => {
        mock({
            '/file.txt': mock.file({
                content: 'file content here',
                mode: 0777
            }),
            '/file.txt.enc': mock.file({
                content: 'file content here',
                mode: 0777
            }),
            '/not-prem-file.txt': mock.file({
                content: 'Not accessable content',
                mode: 0777
            }),
            '/not-prem-file.txt.enc': mock.file({
                content: 'Not accessable content',
                mode: 0777
            })
        });
    });

    afterEach(() => {
        mock.restore();
    })
    

    it('should return promise and call resolve', function(done) {


        fs.rename = stub().callsArgWithAsync(
            2, null
          );

        let file = encrypt({ file: '/file.txt', secret: 'mypassweord'});
        file.then((data) => {
            expect(data).to.equal(true);
            done();
        }).catch((err) => {
            console.log("errr1 :L ", err);
        });
    });

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

});