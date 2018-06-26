require('dotenv-safe').load();

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

import {extractEntities, article} from '../src/services';

describe('integrate_services.js', function(){
    describe('remote data functions online', function(){
        it('article will pass for an valid url', function(){
            this.timeout(5000);
            var url = 'http://www.bbc.co.uk/news/business-40658774';
            var expected = 'Six million men and women';
            var testFunction = () => {
                return article(url)
                    .then(article => {
                        return article.slice(0, 25);
                    });
            };
            return expect(testFunction()).to.eventually.equal(expected);
        });
        it('extractEntities will pass if the NER service is available', function(){
            this.timeout(5000);
            var text = 'John Smith went to Tesco and bought spam';
            var expected = {
                ORGANIZATION: ['Tesco'],
                PERSON: ['John Smith'],
            };
            return expect(extractEntities(text)).to.eventually.deep.equal(expected);
        });
    });
});
