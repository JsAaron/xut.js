/**
 * [ description]
 * @return {[type]} [description]
 */

export function Collection() {
    this.reset();
}

Collection.prototype = {

    register: function(contentObj) {
        if (!this._list) {
            this._list = [contentObj];
        } else {
            this._list.push(contentObj);
        }
    },

    get: function() {
        return this._list;
    },

    //得到一个指定的实例
    specified: function(data) {
        var instance;
        listLength = this._list.length;
        while (listLength) {
            listLength--;
            if (instance = this._list[listLength]) {
                if (instance.type === data.type && instance.id === data.id) {
                    return instance;
                }
            }
        }
    },

    remove: function() {
        this._list = [];
    },

    reset: function() {
        this._list = [];
    }

};
