Xut.Function = {
    /**
     * 包装的另一种方法,最初接受2参数名称和值。
     * 打包函数然后允许“灵活”的值设置要么:
     * @param  {Function} fn [description]
     * @return {[type]}      [description]
     */
    flexSetter: function(fn) {
        return function(a, b) {
            var k, i;

            if (a === null) {
                return this;
            }

            if (typeof a !== 'string') {
                for (k in a) {
                    if (a.hasOwnProperty(k)) {
                        fn.call(this, k, a[k]);
                    }
                }
            } else {
                fn.call(this, a, b);
            }

            return this;
        };
    }

}

if (!Function.prototype.bind) {
    Function.prototype.bind = function(oThis) {
        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function() {},
            fBound = function() {
                return fToBind.apply(this instanceof fNOP && oThis ? this : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}