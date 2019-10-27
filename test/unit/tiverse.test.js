const { expect } = require('chai');
const sinon = require('sinon');
const { stub, fake, spy } = sinon;
const Tiverse = require('../../src/tiverse');
const fs = require('fs');
const path = require('path');

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
    });

    describe('#iterate', function() {

        let pres = null;
        let prej = null;

        beforeEach(() => {

            let promise = new Promise((res, rej) => {
                pres = res;
                prej = rej;
            });

            instance.reduce = stub().returns(['path/to/file']);
            stub(Tiverse, 'getFiles').returns(promise);
        })

        it('should call reject method', function () {
            instance.iterate(new Error('premission denied'), null);
            expect(reject.called);
        });

        it('should call resolve method', function () {
            instance.iterate(null, ['path/to/files']);
            pres(['path/to/file']);
            expect(resolve.called);
        });

        it('should call reject of catch block', function () {
            instance.iterate(null, ['path/to/files']);
            reject('got error');
            expect(reject.called);
        });

        afterEach(() => {
            Tiverse.getFiles.restore();
        })
    });

    describe('#reduce', function() {

        it('should return array', function () {
            let data = [
                'path/to/file1',
                [
                    'path/to/file2',
                    'path/to/file3'
                ]
            ];

            let list = instance.reduce(data);
            expect(list).to.have.members([
                'path/to/file1',
                'path/to/file2',
                'path/to/file3'
            ]);
        });
    });

    describe('#getFiles', function() {

        it('should return a promise', function () {

            let instance = Tiverse.getFiles('path/to/file');
            instance.then((files) => {
                expect(files).to.have.members(['path/to/file']);
            });
        });

    })
});
