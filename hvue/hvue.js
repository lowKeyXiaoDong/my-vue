function defineReactive(obj, key, val) {
  // 递归调用
  observer(val)

  const dep = new Dep()

  Object.defineProperty(obj, key, {
    get() {
      console.log('get', key)

      // 判断一下Dep.target是否存在,存在收集依赖
      Dep.target && dep.addDep(Dep.target)

      return val
    },
    set(v) {
      if (v !== val) {
        console.log('set', key, val)
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

// 创建HVue  MVVM
class HVue {
  constructor(options) {
    // 1: 响应式
    this.$options = options
    this.$data = options.data
    // 进行响应式处理
    observer(this.$data)

    // 1.1 代理属性
    proxy(this)

    // 2: 编译
    new Compile(options.el, this)
  }
}

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
        console.log('文本节点', node.textContent);
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
    // node.textContent = this.$vm[RegExp.$1]
  }

  textUpdater(node, val) {
    node.textContent = val
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
    // node.textContent = this.$vm[exp]
    this.update(node, exp, 'text')
  }

  html(node, exp) {
    // node.innerHTML = this.$vm[exp]
    this.update(node, exp, 'html')
  }

  htmlUpdater(node, val) {
    node.innerHTML = val
  }
}

// 监听器: 负责页面中一个依赖的更新
class Watcher {
  constructor(vm, key, updateFn) {
    this.vm = vm
    this.key = key
    this.updateFn = updateFn

    // 获取一下key的值触发getter方法,在那边创建Watcher 和 Dep的映射关系
    Dep.target = this
    this.vm[this.key]
    Dep.target = null
  }

  update() {
    this.updateFn.call(this.vm, this.vm[this.key])
  }
}

class Dep {
  constructor() {
    this.deps = []
  }

  addDep(dep) {
    this.deps.push(dep)
  }

  notify() {
    this.deps.forEach(dep => dep.update())
  }
}