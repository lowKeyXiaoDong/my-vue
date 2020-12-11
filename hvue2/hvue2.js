function defineReactive(obj, key, val) {
  // 递归调用
  observer(val)

  // 建立管理Watcher
  const dep = new Dep()

  Object.defineProperty(obj, key, {
    get() {
      // 判断一下Dep.target是否存在,存在收集依赖
      Dep.target && dep.addDep(Dep.target)

      return val
    },
    set(v) {
      if (v !== val) {
        val = v

        dep.notify()
      }
    }
  })
}

// 对象响应式: 遍历每一个key,对其进行defineReactive
function observer(obj) {
  // 判断obj是否为对象
  if (typeof obj !== 'object' || obj === null) {
    return
  }

  new Observer(obj)
}

// 创建响应式
class Observer {
  constructor(obj) {
    this.value = obj

    if (Array.isArray(obj)) {
      // TODO 数组
    } else {
      // object
      this.walk(obj)
    }
  }

  walk(obj) {
    Object.keys(obj).forEach(key => {
      defineReactive(obj, key, obj[key])
    })
  }
}

// 将$data属性代理到vue的实例上
function proxy(vm) {
  Object.keys(vm.$data).forEach(key => {
    Object.defineProperty(vm, key, {
      get() {
        return vm.$data[key]
      },
      set(v) {
        vm.$data[key] = v
      }
    })
  })
}

// 创建HVue2  MVVM
class HVue2 {
  constructor(options) {
    // 1: 响应式
    this.$options = options
    this.$data = options.data
    // 进行响应式处理
    observer(this.$data)

    // 1.1 代理 将$data的属性代理到this上，外部调用使用this.count 可以获取到
    proxy(this)

    // 2: 编译
    // new Compile(options.el, this)

    // 如存在el 执行$mount
    if (options.el) {
      this.$mount(options.el)
    }
  }

  // 挂载$mount
  $mount (el) {
    this.$el = document.querySelector(el)

    const updateComponent = () => {
      const { render } = this.$options

      // 调用render获取vnode
      const vnode = render.call(this, this.$createElement)

      // 改变真实dom
      this._update(vnode)
    }

    // 创建Watcher 实例
    new Watcher(this, updateComponent)
  }

  $createElement (tag, props, children) {
    return { tag, props, children }
  }

  _update (vnode) {
    // 获取上一次的vnode
    const parentVnode = this._vnode

    if (!parentVnode) {
      // init 初始化
      this.__patch__(this.$el, vnode)
    } else {
      // update 更新
      this.__patch__(parentVnode, vnode)
    }
  }

  // 新老节点对比 转换真实dom树
  __patch__ (oldVnode, vnode) {
    // nodeType 存在为真实dom
    if (oldVnode.nodeType) {
      // init
      const parent = oldVnode.parentElement
      const refElm = oldVnode.nextSibling

      // props

      // child
      const el = this.createElm(vnode)

      parent.insertBefore(el, refElm)
      parent.removeChild(oldVnode)
    } else { // update
      const el = vnode.el = oldVnode.el
      // props
      const oldProps = oldVnode.props || {}
      const newProps = vnode.props || {}
      for (const key in newProps) {
        el.setAttribute(key, newProps[key])
      }
      for (const key in oldProps) {
        if (!(key in newProps)) {
          el.removeAttribute(key)
        }
      }

      // child
      const oldCh = oldVnode.children
      const newCh = vnode.children
      // text
      if (typeof newCh === 'string') {
        if (typeof oldCh === 'string') {
          if (oldCh !== newCh) {
            el.textContent = newCh
          }
        } else {
          el.textContent = newCh
        }
      } else { // child array
        if (typeof oldCh === 'string') {
          el.innerHTML = ''
          newCh.forEach(child => {
            el.appendChild(this.createElm(child))
          })
        } else { // 重排
          this.updateChild(el, oldCh, newCh)
        }
      }
    }

    this._vnode = vnode
  }

  updateChild (el, oldCh, newCh) {
    const parentElm = el
    const len = Math.max(oldCh.length, newCh.length)

    for (let i = 0; i < len; i++) {
      this.__patch__(oldCh[i], newCh[i])
    }

    // newCh 若是更长的那个， 说明新增
    if (newCh.length > oldCh.length) {
      newCh.slide(len).forEach(child => {
        const el = this.createElm(child)
        parentElm.appendChild(el)
      })
    } else if (newCh.length < oldCh.length) {
      // oldCh 若是更长， 说明有删减
      oldCh.slide(len).forEach(child => {
        parentElm.removeChild(child.el)
      })
    }
  }

  // vnode --> dom
  createElm(vnode) {
    const el = document.createElement(vnode.tag)

    // props
    if (vnode.props) {
      for (const key in vnode.props) {
        const value = vnode.props[key]

        el.setAttribute(key, value)
      }
    }

    // child
    if (vnode.children) {
      if (typeof vnode.children === 'string') {
        // string
        el.textContent = vnode.children
      } else {
        // child array
        vnode.children.forEach(v => {
          const child = this.createElm(v)
          el.appendChild(child)
        })
      }
    }

    // 保存创建真实dom
    vnode.el = el

    return el
  }
}

// 编译类
class Compile {
  constructor(el, vm) {
    // 保存
    this.$el = document.querySelector(el)
    this.$vm = vm

    // 执行编译
    this.compile(this.$el)
  }

  // 判断文本节点 和 插值文本{{}}
  isInter(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
  }

  // 判断是不是h-开头的指令
  isDir(attrName) {
    return attrName.startsWith('h-')
  }

  // 判断是不是事件
  isDomFn(attrName) {
    return attrName.startsWith('@')
  }

  compile(el) {
    // 遍历node节点
    el.childNodes.forEach(node => {
      if (node.nodeType === 1) {
        // 元素
        this.compileElement(node)

        // 递归遍历dom树
        if (node.childNodes.length > 0) {
          this.compile(node)
        }
      } else if (this.isInter(node)) {
        this.compileText(node)
      }
    })
  }

  // 创建统一的更新函数并创建Watcher负责并更新
  update(node, exp, dir) {
    // 初始化
    const fn = this[dir + 'Updater']

    fn && fn(node, this.$vm[exp])

    new Watcher(this.$vm, exp, function (val) {
      fn && fn(node, val)
    })
  }

  // 编译文本节点
  compileText(node) {
    this.update(node, RegExp.$1, 'text')
  }

  // 编辑元素节点
  compileElement(node) {
    // 获取属性节点
    const nodeAttrs = node.attributes
    Array.from(nodeAttrs).forEach(attr => {
      // h-text='xx'
      const attrName = attr.name // h-text
      const exp = attr.value // xx

      if (this.isDir(attrName)) {
        const dir = attrName.substring(2)
        // 指令
        this[dir] && this[dir](node, exp)
      } else if (this.isDomFn(attrName)) {
        const dir = attrName.substring(1)
        // dom事件
        this[dir] && this[dir](node, exp, dir)
      }
    })
  }

  click(node, exp, dir) {
    node.addEventListener(dir, this.$vm.$options.methods[exp].bind(this.$vm))
  }

  text(node, exp) {
    this.update(node, exp, 'text')
  }

  textUpdater(node, val) {
    node.textContent = val
  }

  html(node, exp) {
    this.update(node, exp, 'html')
  }

  htmlUpdater(node, val) {
    node.innerHTML = val
  }

  // h-model 的实现
  model(node, exp) {
    this.update(node, exp, 'model')

    node.addEventListener('input', (e) => {
      this.$vm[exp] = e.target.value
    })
  }

  modelUpdater(node, value) {
    node.value = value
  }
}

// 监听器: 负责页面中一个依赖的更新
class Watcher {
  constructor(vm, fn) {
    this.vm = vm
    
    this.getter = fn

    this.get()

  }

  get() {
    // 获取一下key的值触发getter方法,在那边创建Watcher 和 Dep的映射关系
    Dep.target = this
    this.getter.call(this.vm)
    Dep.target = null
  }

  update() {
    this.get()
  }
}
// Dep Wacther  1 : N
class Dep {
  constructor() {
    // 去重
    this.deps = new Set()
  }

  addDep(dep) {
    this.deps.add(dep)
  }

  notify() {
    this.deps.forEach(dep => dep.update())
  }
}