
var add = require('../src/add.js');

describe('add unit test.', function(){
    var expect = chai.expect;
    it('2 + 3 = 5', function(){
        var result = add(2, 3);
        expect( result).to.equal( 5 );     
    });
});