class VNode {
    constructor(tag, data, children, text) {
        this.tag = tag
        this.data = data
        this.children = children
        this.text = text
    }
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

function patch(oldVnode, vnode) {
    createElm(vnode)
    const isRealElement = oldVnode.nodeType !== undefined
    if(isRealElement){
        let parent = oldVnode.parentNode
        if(parent){
            parent.insertBefore(vnode.elm,oldVnode)
            parent.removeChild(oldVnode)
        }
    }
    return vnode.elm
}

function render() {
    return new VNode(
        'div',
        {
            attrs:{
                'class': 'wrapper'
            }
        },
        [
            new VNode(
                'p',
                {
                    attrs:{
                        class: 'inner'
                    }
                },
                [
                    new VNode(undefined,undefined,undefined, 'Hello world!')
                ]
            )
        ]
    )
}

function mount(el) {
    let vnode = render()
    patch(el,vnode)
}

mount(document.querySelector('#app'))