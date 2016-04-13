Xut.Array = {
    /**
     * 过滤和删除空项数组中定义
     * @param {Array} array
     * @return {Array} results
     */
    clean: function(array) {
        var results = [],
            i, ln, item;

        for (i = 0, ln = array.length; i < ln; i++) {
            item = array[i];

            if (!Xut.isEmpty(item)) {
                results.push(item);
            }
        }

        return results;
    },
    
    toArray: function(array, start, end) {
        return Array.prototype.slice.call(array, start || 0, end || array.length);
    },

    indexOf: function(o, from) {
        var len = this.length;
        from = from || 0;
        from += (from < 0) ? len : 0;
        for (; from < len; ++from) {
            if (this[from] === o) {
                return from;
            }
        }
        return -1;
    },

    remove: function(o) {
        var index = this.indexOf(o);
        if (index != -1) {
            this.splice(index, 1);
        }
        return this;
    }
    
};