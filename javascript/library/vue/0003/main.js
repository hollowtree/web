class VNode {
    constructor(tag, data, children, text, elm) {
        this.tag = tag
        this.data = data
        this.children = children
        this.text = text
        this.elm = elm
    }
}

function nodemalizeChildren(children) {
    return typeof children === 'string' ? [createTextVNode(children)] : children
}

function createTextVNode(val) {
    return new VNode(undefined, undefined, undefined, String(val))
}

function createElement(tag, data, children) {
    return new VNode(tag, data, nodemalizeChildren(children), undefined, undefined)
}

function createElm(vnode) {
    let tag = vnode.tag
    let data = vnode.data
    let children = vnode.children
    let text = vnode.text
    if (tag) {
        vnode.elm = document.createElement(tag)
        var attrs = data.attrs
        if (attrs) {
            for (key in attrs) {
                vnode.elm.setAttribute(key, attrs[key])
            }
        }
        if (children) {
            createChildren(vnode, children)
        }
    } else {
        vnode.elm = document.createTextNode(text)
    }
    return vnode.elm
}

function createChildren(vnode, children) {
    for (var i = 0, l = children.length; i < l; i++) {
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
    let elm = vnode.elm = oldVnode.elm
    let oldCh = oldVnode.children
    let ch = vnode.children
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

function initData(vm) {
    let data = vm.$data = vm.$options.data
    let keys = Object.keys(data)
    var i = keys.length
    while (i--) {
        proxy(vm, keys[i])
    }
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
            vm.update(vm.render())
        }
    })
}

function Vue(options) {
    this.$options = options

    initData(this)
    this.mount(document.querySelector(options.el))
}

Vue.prototype.mount = function (el) {
    this.$el = el
    this.update(this.render())
}

Vue.prototype.update = function (vnode) {
    var preVnode = this._vnode
    this._vnode = vnode
    if (!preVnode) {
        // --- 挂载
        this.$el = this.patch(this.$el, vnode)
    } else {
        this.$el = this.patch(preVnode, vnode)
    }
}

Vue.prototype.patch = patch
function patch(oldVnode, vnode) {
    const isRealElement = oldVnode.nodeType !== undefined
    if (!isRealElement && sameVNode(oldVnode, vnode)) {
        patchVNode(oldVnode, vnode)
    } else {
        if (isRealElement) {
            oldVnode = emptyNodeAt(oldVnode)
        }

        let elm = oldVnode.elm
        let parent = elm.parentNode

        createElm(vnode)
        parent.insertBefore(vnode.elm, elm)
        parent.removeChild(elm)
    }
    return vnode.elm
}

Vue.prototype.render = function () {
    return this.$options.render.call(this)
}

const app = new Vue({
    el: '#app',
    data: {
        message: 'Hello world!',
        isTitle: false
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

console.log('try run `app.message = \'Hello\'`')
console.log('try run `app.isTitle = true`')