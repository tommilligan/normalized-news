var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

import {intAsCharString, intAsColorString} from '../src/counters';

describe('unit_counters.js', function(){
    describe('intAsCharString', function(){
        it('converts integers to single characters', function() {
            expect(intAsCharString(0)).to.equal('A');
            expect(intAsCharString(3)).to.equal('D');
            expect(intAsCharString(25)).to.equal('Z');
        });
        it('converts integers to multiple characters', function() {
            expect(intAsCharString(26)).to.equal('AA');
            expect(intAsCharString((26 * 27) - 1)).to.equal('ZZ');
        });
    });
    describe('intAsColorString', function(){
        it('converts integers to simple HTML colors', function() {
            expect(intAsColorString(0)).to.equal('Aqua');
            expect(intAsColorString(42)).to.equal('Tan');
            expect(intAsColorString(50)).to.equal('Yellow');
        });
        it('converts integers to multiple characters', function() {
            expect(intAsColorString(51)).to.equal('AntiqueAqua');
            expect(intAsColorString(511)).to.equal('PowderAquamarine');
        });
    });
});
