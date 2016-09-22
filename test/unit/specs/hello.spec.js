import {
    add
}
from '../../../src/lib/test'

let expect = chai.expect;

describe('add * unit test.', function() {
    expect = chai.expect;
    it('2 + 3 = 5', function() {
        var result = add(2, 3);
        expect(result).to.equal(5);
    });
});
  