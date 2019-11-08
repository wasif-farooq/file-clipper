const { expect } = require('chai');
const { stub } = require('sinon');
const Clipper = require('../../src/index');
const tiverse = require('../../src/Tiverse');
const path = require('path');

describe("#Clipper", function() {
    describe('#constructor', function() {
        let clipper = new Clipper();
        expect(clipper.action).to.be.false;
        expect(clipper.path).to.be.equal(null);
        expect(clipper.secret).to.be.equal(null);
    });

    describe('#getFiles', function() {

        let clipper = new Clipper();
        let getFiles;

        beforeEach(() => {
            stub(clipper, 'resolve').returns('path/to/file');
            stub(tiverse, 'getFiles').resolves(['path/to/file']);
        });

        afterEach(() => {
            clipper.resolve.restore();
            tiverse.getFiles.restore();
        })

        it('should return the path for a file', async function () {
            let files = await clipper.getFiles();
            expect(files).to.be.includes('path/to/file');
        });
    });

    describe('#resolve', function() {
        let clipper = new Clipper();

        beforeEach(() => {
            stub(path, 'resolve').returns('path/to/file');
        });

        afterEach(() => {
            path.resolve.restore();
        });

        it('should return absolute path', async function () {
            let fullPath = await clipper.resolve('file');
            expect(fullPath).to.be.equal('path/to/file');
        });
    });

    describe('#start', function () {

        let run;
        beforeEach(() => {
            run = stub(Clipper.prototype, 'run');
        });

        afterEach(() => {
            Clipper.prototype.run.restore();
        });

        it('should set the action and call the run function if mode is encrypt', function () {
            let instance = Clipper.start({
                mode: 'encrypt',
                path: 'file',
                secret: 'mypass'
            });

            expect(instance.action).to.not.equal(false);
            expect(run.called).to.be.true;
        });

        it('should set the action and call the run function if mode is decrypt', function () {
            let instance = Clipper.start({
                mode: 'decrypt',
                path: 'file',
                secret: 'mypass'
            });

            expect(instance.action).to.not.equal(false);
            expect(run.called).to.be.true;
        });

        it('should call the run event action not set', function () {
            let instance = Clipper.start({
                mode: '',
                path: 'file',
                secret: 'mypass'
            });

            expect(instance.action).to.be.equal(false);
            expect(run.called).to.be.true;
        });
    });

    describe('#run', function () {
        let clipper = new Clipper();
        let action;
        let getFiles;

        beforeEach(() => {
            getFiles = stub(clipper, 'getFiles');
        });

        afterEach(() => {
            clipper.getFiles.restore();
        });

        it('should  return false if action is no set', function () {
            expect(clipper.run()).to.be.false;
        });

        it('should call the action', function () {
            clipper.action = stub().resolves(true);
            getFiles.resolves(['path/to/file']);
            clipper.run();
            expect(getFiles.called).to.be.true;
        });

        it('should call the catch block', function () {
            clipper.action = stub().resolves(true);
            getFiles.rejects(new Error('file not found'));
            clipper.run();
            expect(getFiles.called).to.be.true;
        });
    })
})
