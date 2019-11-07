const { expect } = require('chai');
const { stub } = require('sinon');
const Transform = require('../../src/transform');

describe('#Transform', function() {

    describe('#constructor', function() {
        let transform;

        beforeEach(() => {
            transform = new Transform('1234567890');
        });

        afterEach(() => {
            transform = undefined;
        })

        it('should set init vector', function () {
            expect(transform.initVect).to.be.equal('1234567890');
            expect(transform.appended).to.be.false;
        });
    });

    describe('#transform', function() {
        let transform;
        let callback;

        beforeEach(() => {
            transform = new Transform('1234567890');
            callback = stub();
            stub(transform, 'push').returns(true);
        });

        afterEach(() => {
            transform = undefined;
        })

        it('should append vector in chunk on first call', function () {
            transform.appended = false;
            transform._transform('abcd', 'utf', callback);
            expect(callback.called).to.be.true;
            expect(transform.appended).to.be.true;
            expect(transform.push.called).to.be.true;
        });

        it('should not append vector in chunk on second call', function () {
            transform.appended = true;
            transform._transform('abcd', 'utf', callback);
            expect(callback.called).to.be.true;
            expect(transform.appended).to.be.true;
            expect(transform.push.called).to.be.true;
        });
    })
})
