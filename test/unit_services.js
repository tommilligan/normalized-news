require('dotenv-safe').load();
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var axios = require('axios');
var moxios = require('moxios');

import {extractEntities, article} from '../src/services';

describe('integrate_services.js', function(){
    describe('axios mocked content', function(){
        beforeEach(function(){
            moxios.install(axios);
        });
        afterEach(function(){
            moxios.uninstall(axios);
        });
        it('article will grab paragraph content from html', function(){
            var url = 'http://www.bbc.co.uk/news/business-40658774';
            var expected = 'Six million men and women will have to wait a year longer than they expected to get their state pension, the government has announced.\n\nThe rise in the pension age to 68 will now be phased in between ';

            var stubHtml = `<!DOCTYPE html>
<html>
<head></head>
<body>
<p class="twite__title" aria-hidden="true">Share this with</p>
<p class="twite__channel-text" aria-hidden="true">Email</p>
<p class="twite__channel-text" aria-hidden="true">Facebook</p>
<p class="twite__channel-text" aria-hidden="true">Messenger</p>
<p class="twite__channel-text" aria-hidden="true">Messenger</p>
<p class="twite__channel-text" aria-hidden="true">Twitter</p>
<p class="twite__channel-text" aria-hidden="true">Pinterest</p>
<p class="twite__channel-text" aria-hidden="true">WhatsApp</p>
<p class="twite__channel-text" aria-hidden="true">LinkedIn</p>
<p class="twite__copy-text">Copy this link</p>
<p class="twite__new-window" aria-hidden="true">These are external links and will open in a new window</p>
<p class="story-body__introduction">Six million men and women will have to wait a year longer than they expected to get their state pension, the government has announced.</p>
<p>The rise in the pension age to 68 will now be phased in between 2037 and 2039, rather than from 2044 as was originally proposed.</p>
<p>Those affected are currently between the ages of 39 and 47.</p>
<p>The announcement was made in the Commons by the Secretary of State for Work and Pensions, David Gauke.</p>
<p>He said the government had decided to accept the recommendations of the <a href="https://www.gov.uk/government/publications/state-pension-age-independent-review-final-report" class="story-body__link-external">Cridland report</a>, which proposed the change.</p>
</body>
</html>`;
            
            moxios.wait(function () {
                let request = moxios.requests.mostRecent();
                request.respondWith({
                    status: 200,
                    response: stubHtml
                });
            });

            var testFunction = () => {
                return article(url)
                    .then(article => {
                        return article.slice(0, 200);
                    });
            };
            return expect(testFunction()).to.eventually.equal(expected);
        });
        it('extractEntities will return nervous-efficient-rebel response as object', function(){
            var text = 'John Smith went to Tesco and bought spam';
            var stubJson = {
                DATE:[],
                LOCATION:[],
                MONEY: [],
                ORGANIZATION: ['Tesco'],
                PERCENT: [],
                PERSON: ['John Smith'],
                TIME: []
            };

            moxios.wait(function () {
                let request = moxios.requests.mostRecent();
                request.respondWith({
                    status: 200,
                    response: stubJson
                });
            });

            return expect(extractEntities(text)).to.eventually.deep.equal(stubJson);
        });
    });
    describe('axios mocked offline', function(){
        beforeEach(function(){
            moxios.install(axios);
        });
        afterEach(function(){
            moxios.uninstall(axios);
        });
        it('article will fail', function(){
            var url = 'http://www.bbc.co.uk/news/business-40658774';

            moxios.wait(function () {
                let request = moxios.requests.mostRecent();
                request.respondWith({
                    status: 503
                });
            });

            var testFunction = () => {
                return article(url)
                    .then(article => {
                        return article.slice(0, 200);
                    });
            };
            return expect(testFunction()).to.eventually.be.rejectedWith('Could not get article');
        });
        it('extractEntities will fail', function(){
            var text = 'John Smith went to Tesco and bought spam';

            moxios.wait(function () {
                let request = moxios.requests.mostRecent();
                request.respondWith({
                    status: 503
                });
            });

            return expect(extractEntities(text)).to.eventually.be.rejected;
        });
    });
});
