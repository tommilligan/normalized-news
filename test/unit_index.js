var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var normalizedNews = require('../src/index');
var services = require('../src/services');

describe('unit_index.js', function(){
    describe('text passes', function(){
        describe('anonymize', function(){
            it('should replace named entities', function(){
                var text = 'John Smith went to Tesco to buy carrots for dinner.';
                var entities = {'PERSON': ['John Smith'], 'ORGANIZATION': ['Tesco'], 'LOCATION':[]};
                var expected = 'PERSON went to ORGANIZATION to buy carrots for dinner.';
                return expect(normalizedNews.anonymize(text, entities)).to.eventually.equal(expected);
            });
        });
        describe('neutralize', function(){
            it('should neutralize pronouns', function(){
                var text = 'He went to buy carrots for dinner.';
                var expected = 'They went to buy carrots for dinner.';
                return expect(normalizedNews.neutralize(text)).to.eventually.equal(expected);
            });
        });
    });
    describe('end-to-end (stubbed)', function(){
        describe('normalize', function(){
            beforeEach(function() {
                var stubReturn = {PERSON: ['John Smith'], ORGANIZATION: [], LOCATION: []};
                sinon.stub(services, 'extractEntities').returns(
                    new Promise((resolve) => {
                        resolve(stubReturn);
                    }));
            });
            afterEach(function() {
                services.extractEntities.restore();
            });
            it('should replace named entities and neutralize pronouns', function(){
                var text = 'She said that John Smith\'s company had decided to sue.';
                var expected = 'They said that PERSON\'s company had decided to sue.';
                return expect(normalizedNews.normalize(text)).to.eventually.equal(expected);
            });
        });
    });
});
