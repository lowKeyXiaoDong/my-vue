// 注册插件
let Vue
class Store {
  constructor(options) {
    // 选项处理
    this._mutations = options.mutations
    this._actions = options.actions
    this._warpGetters = options.getters

    // 定义computed
    const computed = {}
    this.getters = {}
    const store = this

    Object.keys(this._warpGetters).forEach(key => {
      const fn = store._warpGetters[key]

      computed[key] = function () {
        return fn(store.state)
      }

      Object.defineProperty(store.getters, key, {
        get: () => store._vm[key]
      })
    })

    this._vm = new Vue({
      data: {
        $$state: options.state,
      },
      computed
    })

    this.commit = this.commit.bind(this)
    this.dispatch = this.dispatch.bind(this)
  }

  get state() {
    return this._vm._data.$$state
  }

  set state(v) {
    console.error('no set state')
  }

  // 实现commit方法
  commit(type, payload) {
    const entry = this._mutations[type]

    if (!entry) {
      console.error(`on mutations ${type}`)
      return
    }

    entry(this.state, payload)
  }

  // 实现dispatch方法
  dispatch(type, payload) {
    const entry = this._actions[type]

    if (!entry) {
      console.error(`on actions ${type}`)
      return
    }

    entry(this, payload)
  }
}

function install(_Vue) {
  Vue = _Vue

  Vue.mixin({
    beforeCreate() {
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store
      }
    },
  })
}

export default { Store, install }
