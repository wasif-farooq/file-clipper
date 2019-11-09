const { expect } = require('chai');
const fs = require('fs');
const path = require('path');
const Clipper = require('../../src/index');
const ecp = require('event-callback-promise');

describe('File Clipper Integration test', () => {

    describe('Test File Encryption', () => {

        const file = path.join(__dirname, 'file.txt');

        beforeEach(async () => {
            await ecp(fs.writeFile)(file, 'this is a content');
        });

        afterEach(async () => {
            await ecp(fs.unlink)(file);
        });

        it('should encrypt the file', (done) => {
            const clipper = Clipper.start({
                mode: 'encrypt',
                path: file,
                secret: 'mypassword'
            });

            clipper.done().then((data) => {
                expect(data[0]).to.be.true;
                done();
            })
        });
    });

    describe('Test File Decryption', () => {

        const file = path.join(__dirname, 'file.txt');
        let clipper;

        beforeEach(async () => {
            await ecp(fs.writeFile)(file, 'this is a content');
            clipper = Clipper.start({
                mode: 'encrypt',
                path: file,
                secret: 'mypassword'
            });
        });

        afterEach(async () => {
            await ecp(fs.unlink)(file);
        });

        it('should encrypt the file', (done) => {
            clipper.done().then((data) => {

                const declipper = Clipper.start({
                    mode: 'decrypt',
                    path: file,
                    secret: 'mypassword'
                })

                declipper.done().then(() => {
                    expect(data[0]).to.be.true;
                    done();
                }).catch(() => {
                    // thorw error
                })

                done();
            }).catch(() => {
                // throw error
            })
        });
    });
})
