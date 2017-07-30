var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

import {anonymize, neutralize} from '../src/passes';

describe('unit_passes.js', function(){
    describe('anonymize', function(){
        it('should replace named entities', function(){
            var text = 'John Smith went to Tesco to buy carrots for dinner.';
            var entities = {'PERSON': ['John Smith'], 'ORGANIZATION': ['Tesco']};
            var expected = 'Person-A went to Organization-Aqua to buy carrots for dinner.';
            return expect(anonymize(text, entities)).to.eventually.equal(expected);
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
