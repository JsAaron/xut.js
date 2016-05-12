let uid = 0

/**
 * 依赖订阅
 */
function Dep() {
    this.id = uid++;
    this.subs = []
}

Dep.prototype.addSub = function(sub) {
    this.subs.push(sub)
}

Dep.prototype.removeSub = function(sub) {
    this.subs = [];
}

Dep.prototype.notify = function() {
    if (this.subs.length) {
        console.log('依赖队列')
    }
}

export {Dep}