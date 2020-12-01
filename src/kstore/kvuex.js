// 注册插件
let Vue
class Store {
  constructor(options) {
    // 选项处理
    this._mutations = options.mutations
    this._actions = options.actions
    this.getters = options.getters

    this._vm = new Vue({
      data: {
        $$state: options.state,
      },
    })

    this.commit = this.commit.bind(this)
    this.dispatch = this.dispatch.bind(this)

    this.resetStoreVM()
  }

  resetStoreVM() {
    Object.keys(this.getters).forEach((item) => {
      const rawGetters = this.getters[item]
      const that = this
      Object.defineProperty(this.getters, item, {
        get() {
          return rawGetters(that._vm._data.$$state)
        },
      })
    })
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
