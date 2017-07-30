var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

import {provideCodenames} from '../src/codenames';

describe('unit_codenames.js', function(){
    describe('default codenaming functions', function(){
        it('convert people to letters', function() {
            expect(provideCodenames({PERSON: ['Tom']}))
                .to.deep.equal([{entity: 'Tom', codename: 'Person-A'}]);
        });
        it('convert organizations to colors', function() {
            expect(provideCodenames({ORGANIZATION: ['Tescos']}))
                .to.deep.equal([{entity: 'Tescos', codename: 'Organization-Aqua'}]);
        });
        it('convert locations to numbers', function() {
            expect(provideCodenames({LOCATION: ['London']}))
                .to.deep.equal([{entity: 'London', codename: 'Location-0'}]);
        });
        it('ignore other entities, but warn', function() {
            expect(provideCodenames({TIME: ['1969']}))
                .to.deep.equal([]);
        });
    });
    it('will accept custom functions', function(){
        expect(provideCodenames({PERSON: ['Tom', 'Dick', 'Harry']}, {PERSON: i => i**2}))
            .to.deep.equal([
                {entity: 'Tom', codename: 'Person-0'},
                {entity: 'Dick', codename: 'Person-1'},
                {entity: 'Harry', codename: 'Person-4'}
            ]);
    });
    it('will deduplicate entities', function(){
        expect(provideCodenames({PERSON: ['Tom', 'Harry', 'Tom']}))
            .to.deep.equal([
                {entity: 'Tom', codename: 'Person-A'},
                {entity: 'Harry', codename: 'Person-B'}
            ]);
    });
    it('will ignore entites with missing codenaming functions', function(){
        expect(provideCodenames({PERSON: ['Tom']}, {}))
            .to.deep.equal([]);
    });
});
