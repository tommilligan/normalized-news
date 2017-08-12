require('dotenv-safe').load();

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var services = require('../src/services');
import {anonymize, neutralize} from '../src/passes';

describe('unit_passes.js', function(){
    describe('anonymize', function(){
        beforeEach(function() {
            var stubReturn = {PERSON: ['John Smith'], ORGANIZATION: ['Tesco']};
            sinon.stub(services, 'extractEntities').resolves(stubReturn);
        });
        afterEach(function() {
            services.extractEntities.restore();
        });
        it('should replace named entities', function(){
            var text = 'John Smith went to Tesco to buy carrots for dinner.';
            var expected = 'Person-A went to Organization-Aquamarine to buy carrots for dinner.';
            return expect(anonymize(text)).to.eventually.equal(expected);
        });
    });
    describe('neutralize', function(){
        it('should neutralize pronouns', function(){
            var text = 'He went to buy carrots for dinner.';
            var expected = 'They went to buy carrots for dinner.';
            return expect(neutralize(text)).to.eventually.equal(expected);
        });
    });
});
