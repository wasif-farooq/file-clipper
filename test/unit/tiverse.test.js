const { expect } = require('chai');
const sinon = require('sinon');
const { stub, fake, spy } = sinon;
const Tiverse = require('../../src/tiverse');
const fs = require('fs');

describe('#Tiverse', function() {

    let instance = null;
    let resolve = null;
    let reject = null;

    beforeEach(() => {
        fs.access = stub();
        fs.stat = stub();
        fs.readdir = stub();

        resolve = spy();
        reject = spy();

        instance = new Tiverse('path/to/file', resolve, reject);;
    })

    describe('#constructor', function() {
        it('Should Update link, resolve, reject variables', function() {
            expect(instance.link).to.equal('path/to/file');
        });
    })

    describe('#start', function() {
        it('Should Not throw exception', function() {
            expect(instance.link).to.equal('path/to/file');
        });
    });

    describe('#stats', function () {

        beforeEach(() => {
            instance.read = spy();
        })

        it('should call reject function', function () {
            instance.stats(new Error('premission denied'));
            expect(reject.called);
        });

        it('should not call read method', function () {
            instance.stats(null);
            expect(instance.read.called);
        });
    });

    describe('#read', function() {

        it('should call reject', function() {
            instance.read(new Error('premission denied'), null);
            expect(reject.called);
        });

        it('should call resolve if not a directory', function () {

            let data = {
                isDirectory: stub().returns(false)
            };

            instance.read(null, data);
            expect(data.isDirectory.called);
            expect(resolve.called);
        });

        it('should read directory if it is a directory', function () {
            let data = {
                isDirectory: stub().returns(true)
            };

            instance.read(null, data);
            expect(data.isDirectory.called);
            expect(fs.readdir.called);
            expect(resolve.called);
        });
    })
});
