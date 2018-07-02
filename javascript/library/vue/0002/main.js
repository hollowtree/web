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
    const vnode = this.$options.render.call(this)
    this.patch(this.$el, vnode)
}

Vue.prototype.patch = function (oldVnode, vnode) {
    const isRealElement = oldVnode.nodeType !== undefined
    if (isRealElement) {
        createElm(vnode)
        let parent = oldVnode.parentNode
        if (parent) {
            parent.insertBefore(vnode.elm, oldVnode)
            parent.removeChild(oldVnode)
        }
    }
    return vnode.elm
}

const app = new Vue({
    el:'#app',
    data:{
        message: 'Hello world!'
    },
    render(){
        return createElement(
            'div',
            {
                attrs:{
                    class:'wrapper'
                }
            },
            [
                createElement(
                    'p',
                    {
                        attrs:{
                            class: 'inner'
                        }
                    },
                    this.message
                )
            ]
        )
    }
})
