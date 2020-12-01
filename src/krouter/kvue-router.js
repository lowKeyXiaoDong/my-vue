// 挂载插件
let Vue
class VueRouter {
  constructor(options) {
    this.options = options

    const initCurrent = window.location.hash.slice(1) || '/'
    Vue.util.defineReactive(this, 'current', initCurrent)

    window.addEventListener('hashchange', this.onHashChange.bind(this))
  }

  onHashChange() {
    this.current = window.location.hash.slice(1)
  }
}

VueRouter.install = function(_Vue) {
  Vue = _Vue

  Vue.mixin({
    beforeCreate() {
      if (this.$options.router) {
        Vue.prototype.$router = this.$options.router
      }
    },
  })

  Vue.component('router-link', {
    props: {
      to: {
        type: String,
        required: true,
      },
    },
    render(h) {
      return h('a', { attrs: { href: this.to } }, this.$slots.default)
    },
  })

  Vue.component('router-view', {
    render(h) {
      let Component = null
      const route = this.$router.options.routes.find(
        (route) => route.path === this.$router.current
      )
      if (route) {
        Component = route.component
      }
      return h(Component)
    },
  })
}

export default VueRouter
