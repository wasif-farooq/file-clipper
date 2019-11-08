const { expect } = require('chai');
const { stub } = require('sinon');
const Tiverse = require('../../src/Tiverse');


describe('#Tiverse', () => {

    let instance = null;

    beforeEach(() => {
        instance = new Tiverse('path/to/file');
    })

    describe('#constructor', () => {
        it('Should Update link and promisify access, stat, readdir function', () => {
            expect(instance.link).to.equal('path/to/file');
            expect(instance.access).to.be.a('function');
            expect(instance.stat).to.be.a('function');
            expect(instance.readdir).to.be.a('function');
        });
    })

    describe('#start', () => {

        let stat;
        let iterate;
        let reduce;

        beforeEach(() => {
            stub(instance, 'access').returns(true);
            stat = stub(instance, 'stat');
            stub(instance, 'readdir');
            iterate = stub(instance, 'iterate').returns([]);
            reduce = stub(instance, 'reduce').returns([]);
        });

        afterEach(() => {
            instance.access.restore();
            instance.stat.restore();
            instance.readdir.restore();
            instance.iterate.restore();
            instance.reduce.restore();
        });

        it('Should just return passed link as array', async () => {

            stat.returns({
                isDirectory: stub().returns(false)
            });
            reduce.returns(['path/to/file']);

            const data = await instance.start();
            expect(data).to.be.a('array');
            expect(data).to.includes('path/to/file');
        });

        it('Should just return ', async () => {

            stat.returns({
                isDirectory: stub().returns(true)
            });

            iterate.returns(['path/to/file', ['path/to/file2']]);
            reduce.returns(['path/to/file', 'path/to/file2']);

            const data = await instance.start();

            expect(iterate.called).to.be.true;
            expect(reduce.called).to.be.true;
            expect(data).to.be.a('array');
            expect(data).to.includes('path/to/file');
            expect(data).to.includes('path/to/file2');
        });
    });

    describe('#iterate', () => {

        let readdir;

        beforeEach(() => {
            readdir = stub(instance, 'readdir');
            Tiverse.getFiles =
            stub(Tiverse, 'getFiles').resolves('path/to/file/file1');
        });

        afterEach(() => {
            instance.readdir.restore();
            Tiverse.getFiles.restore();
        });

        it('should return all file in directory', async () => {
            readdir.returns([
                'file1'
            ]);

            const data = await instance.iterate();
            expect(data).to.be.a('array');
            expect(data.length).to.be.equal(1);
            expect(data).to.includes('path/to/file/file1');
        });
    });

    describe('#reduce', () => {
        it('should return empty array if passing empty array', async () => {
            const data = await instance.reduce([]);
            expect(data).to.be.a('array');
            expect(data.length).to.be.equal(0);
        });

        it('should return return reduced array of length one', async () => {
            const data = await instance.reduce(['path/to/file']);
            expect(data).to.be.a('array');
            expect(data.length).to.be.equal(1);
        });

        it('should return return reduced array of length three', async () => {
            const param = [
                'path/to/file',
                [
                    'path/to/file2',
                    [
                        'path/to/file3'
                    ]
                ]
            ]
            const data = await instance.reduce(param);
            expect(data).to.be.a('array');
            expect(data.length).to.be.equal(3);
            expect(data).to.include('path/to/file');
            expect(data).to.include('path/to/file2');
            expect(data).to.include('path/to/file3');
        });
    });

    describe('#getFiles', () => {

        beforeEach(() => {
            stub(Tiverse.prototype, 'start').resolves(['path/to/file']);
        });

        afterEach(() => {
            Tiverse.prototype.start.restore();
        })

        it('should return link as array', async () => {
            const data = await Tiverse.getFiles('path/to/file');
            expect(data).to.be.a('array');
            expect(data.length).to.be.equal(1);
            expect(data).to.include('path/to/file');
        });
    })
});
