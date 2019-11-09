const { expect } = require('chai');
const { stub } = require('sinon');
const Clipper = require('../../src/index');
const tiverse = require('../../src/Tiverse');
const path = require('path');

describe("#Clipper", () => {
    describe('#constructor', () => {
        const clipper = new Clipper();
        expect(clipper.action).to.be.false;
        expect(clipper.path).to.be.equal(null);
        expect(clipper.secret).to.be.equal(null);
    });

    describe('#getFiles', () => {

        const clipper = new Clipper();

        beforeEach(() => {
            stub(tiverse, 'getFiles').resolves(['path/to/file']);
            stub(path, 'resolve').returns('path/to/file');
        });

        afterEach(() => {
            tiverse.getFiles.restore();
            path.resolve.restore();
        })

        it('should return the path for a file', async () => {
            const files = await clipper.getFiles();
            expect(files).to.be.includes('path/to/file');
        });
    });

    describe('#start', () => {

        let run;
        beforeEach(() => {
            run = stub(Clipper.prototype, 'run');
        });

        afterEach(() => {
            Clipper.prototype.run.restore();
        });

        it('should set the action and call the run function if mode is encrypt', () => {
            const instance = Clipper.start({
                mode: 'encrypt',
                path: 'file',
                secret: 'mypass'
            });

            expect(instance.action).to.not.equal(false);
            expect(run.called).to.be.true;
        });

        it('should set the action and call the run function if mode is decrypt', () => {
            const instance = Clipper.start({
                mode: 'decrypt',
                path: 'file',
                secret: 'mypass'
            });

            expect(instance.action).to.not.equal(false);
            expect(run.called).to.be.true;
        });

        it('should call the run event action not set', () => {
            const instance = Clipper.start({
                mode: '',
                path: 'file',
                secret: 'mypass'
            });

            expect(instance.action).to.be.equal(false);
            expect(run.called).to.be.true;
        });
    });

    describe('#run', () => {
        const clipper = new Clipper();
        let getFiles;

        beforeEach(() => {
            getFiles = stub(clipper, 'getFiles');
        });

        afterEach(() => {
            clipper.getFiles.restore();
        });

        it('should  return false if action is no set', () => {
            expect(clipper.run()).to.be.false;
        });

        it('should call the action', () => {
            clipper.action = stub().resolves(true);
            getFiles.resolves(['path/to/file']);
            clipper.run();
            expect(getFiles.called).to.be.true;
        });

        it('should call the catch block', () => {
            clipper.action = stub().resolves(true);
            getFiles.rejects(new Error('file not found'));
            clipper.run();
            expect(getFiles.called).to.be.true;
        });
    })
})
