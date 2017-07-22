var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

import {normalize, anonymize} from '../src/index';

describe('index.js', function(){
    describe('anonymize', function(){
        it('should replace named entities', function(){
            var text = 'John Smith went to Tesco to buy carrots for dinner.';
            var entities = {'PERSON': ['John Smith'], 'ORGANIZATION': ['Tesco'], 'LOCATION':[]};
            var expected = 'PERSON went to ORGANIZATION to buy carrots for dinner.';
            return expect(anonymize(text, entities)).to.eventually.equal(expected);
        });
    });
    describe('normalize', function(){
        it('should replace named entities and neutralize pronouns', function(){
            var text = 'She said that John Smith\'s company had decided to sue.';
            var expected = 'They said that PERSON\'s company had decided to sue.';
            return expect(normalize(text)).to.eventually.equal(expected);
        });
    });
});
