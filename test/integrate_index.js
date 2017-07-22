var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

import {normalizeNews} from '../src/index';

describe('index.js', function(){
    describe('normalizeNews functions', function(){
        it('work on a known BBC news article', function(){
            this.timeout(5000);
            var text = 'http://www.bbc.co.uk/news/business-40658774';
            var expected = 'Six million men and women';
            var testFunction = () => {
                return normalizeNews(text)
                    .then(article => {
                        return article.slice(0, 25);
                    });
            };
            return expect(testFunction()).to.eventually.equal(expected);
        });
    });
});
