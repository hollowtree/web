// -------------------------------------- Dep
var uid = 0
function Dep() {
    this.subs = []
    this.id = uid++
}
Dep.target = null

Dep.prototype.addSub = function (sub) {
    this.subs.push(sub)
}

Dep.prototype.notify = function () {
    var subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
        subs[i].update()
    }
}

// -------------------------------------- Watcher
function Watcher(vm, expOrFn, cb) {
    this.vm = vm
    this.getter = expOrFn
    this.cb = cb
    this.depIds = []
    this.value = this.get()
}

Watcher.prototype.get = function () {
    Dep.target = this
    var value = this.getter.call(this.vm)
    Dep.target = null
    return value
}

Watcher.prototype.update = function () {
    var value = this.get()
    if (this.value !== value) {
        var oldValue = this.value
        this.value = value
        this.cb.call(this.vm, value, oldValue)
    }
}

Watcher.prototype.addDep = function (dep) {
    var id = dep.id
    if (this.depIds.indexOf(id) === -1) {
        this.depIds.push(id)
        dep.addSub(this)
    }
}


// -------------------------------------- observe
function defineReactive(obj, key, val) {
    var dep = new Dep()
    Object.defineProperty(obj, key, {
        get: function () {
            if (Dep.target) {
                Dep.target.addDep(dep)
            }
            return val
        },
        set: function (newVal) {
            if (newVal === val) return
            val = newVal
            dep.notify()
        }
    })
}

function observe(obj) {
    for (var key in obj) {
        defineReactive(obj, key, obj[key])
    }
}


// -------------------------------------- use
const data = {
    message: 'Hello World!'
}
observe(data)
new Watcher(data, function () {
    document.write(this.message)
})