var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var passes = require('../src/passes');
var normalizedNews = require('../src/index');

describe('unit_index.js', function(){
    describe('normalize', function(){
        var stubAnon;
        var stubNeut;
        beforeEach(function() {
            stubAnon = sinon.stub(passes, 'anonymize').resolves('spam');
            stubNeut = sinon.stub(passes, 'neutralize').resolves('eggs');
        });
        afterEach(function() {
            stubAnon.restore();
            stubNeut.restore();
        });
        it('should run through all passes', function(){
            var normal = normalizedNews.normalize('eels');
            return Promise.all([
                expect(normal).to.eventually.equal('eggs'),
                normal.then(() => expect(stubAnon).to.have.been.calledWith('eels')),
                normal.then(() => expect(stubNeut).to.have.been.calledWith('spam'))
            ]);
        });
    });
});
