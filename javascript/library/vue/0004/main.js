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
    var subs = this.subs
    for (let i = 0, l = subs.length; i < l; i++) {
        subs[i].update()
    }
}

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

class VNode {
    constructor(tag, data, children, text, elm) {
        this.tag = tag
        this.data = data
        this.children = children
        this.text = text
        this.elm = elm
    }
}

function normalizeChildren(children) {
    return typeof children === 'string' ? [createTextVNode(children)] : children
}

function createTextVNode(val) {
    return new VNode(undefined, undefined, undefined, String(val))
}

function createElement(tag, data, children) {
    return new VNode(tag, data, normalizeChildren(children), undefined, undefined)
}

function createElm(vnode) {
    var tag = vnode.tag
    var data = vnode.data
    var children = vnode.children

    if (tag !== undefined) {
        vnode.elm = document.createElement(tag)
        if (data.attrs !== undefined) {
            var attrs = data.attrs
            for (var key in attrs) {
                vnode.elm.setAttribute(key, attrs[key])
            }
        }
        if (children) {
            createChildren(vnode, children)
        }
    } else {
        vnode.elm = document.createTextNode(vnode.text)
    }
    return vnode.elm
}

function createChildren(vnode, children) {
    for (var i = 0; i < children.length; i++) {
        vnode.elm.appendChild(createElm(children[i]))
    }
}

function sameVNode(vnode1, vnode2) {
    return vnode1.tag === vnode2.tag
}

function emptyNodeAt(elm) {
    return new VNode(elm.tagName.toLowerCase(), {}, [], undefined, elm)
}

function patchVNode(oldVnode, vnode) {
    var elm = vnode.elm = oldVnode.elm
    var oldCh = oldVnode.children
    var ch = vnode.children

    if (!vnode.text) {
        if (oldCh && ch) {
            updateChildren(oldCh, ch)
        }
    } else if (oldVnode.text !== vnode.text) {
        elm.textContent = vnode.text
    }
}


function updateChildren(oldCh, ch) {
    if (sameVNode(oldCh[0], ch[0])) {
        patchVNode(oldCh[0], ch[0])
    } else {
        patch(oldCh[0], ch[0])
    }
}

function patch(oldVnode, vnode) {
    var isRealElmment = oldVnode.nodeType !== undefined
    if (!isRealElmment && sameVNode(oldVnode, vnode)) {
        patchVNode(oldVnode, vnode)
    } else {
        if (isRealElmment) {
            oldVnode = emptyNodeAt(oldVnode)
        }
        var elm = oldVnode.elm
        var parent = elm.parentNode

        createElm(vnode)

        parent.insertBefore(vnode.elm, elm)
        parent.removeChild(elm)
    }
    return vnode.elm
}

function initData(vm) {
    var data = vm.$data = vm.$options.data
    var keys = Object.keys(data)
    var i = keys.length

    while (i--) {
        proxy(vm, keys[i])
    }
    observe(data)
}

function proxy(vm, key) {
    Object.defineProperty(vm, key, {
        configurable: true,
        enumerable: true,
        get: function () {
            return vm.$data[key]
        },
        set: function (val) {
            vm.$data[key] = val
        }
    })
}

function Vue(options) {
    var vm = this
    vm.$options = options
    initData(vm)
    vm.mount(document.querySelector(options.el))
}

Vue.prototype.mount = function (el) {
    var vm = this
    console.log(vm)

    vm.$el = el
    new Watcher(vm, function () {
        vm.update(vm.render())
    })
}

Vue.prototype.update = function (vnode) {
    var vm = this
    var preVnode = vm._vnode
    vm._vnode = vnode
    if (!preVnode) {
        vm.$el = vm.patch(vm.$el, vnode)
    } else {
        vm.$el = vm.patch(preVnode, vnode)
    }
}

Vue.prototype.patch = patch

Vue.prototype.render = function () {
    var vm = this
    return vm.$options.render.call(vm)
}

var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello world!',
    },
    render() {
        return createElement(
            'div',
            {
                attrs: {
                    class: 'wrapper'
                }
            },
            [
                createElement(
                    this.isTitle ? 'h1' : 'p',
                    {
                        attrs: {
                            'class': 'inner'
                        }
                    },
                    this.message
                )

            ]
        )
    }
})
