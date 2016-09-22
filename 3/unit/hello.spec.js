describe('is a+b', function() {
    it('1+2=3', function() {
        var result = add(1, 2);
        expect(result).toBe(3);
    })

    it('2 + 3 = 6, this should faild.', function(){
        var result = add( 2, 3 );
        expect(result).toBe( 2 );
    })

})
