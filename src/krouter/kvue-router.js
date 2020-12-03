// 挂载插件
let Vue
class VueRouter {
  constructor(options) {
    this.options = options

    this.current = window.location.hash.slice(1) || '/'
    Vue.util.defineReactive(this, 'matched', [])
    // 递归所有的路由包括子路由
    this.match()

    window.addEventListener('hashchange', this.onHashChange.bind(this))
  }

  onHashChange() {
    this.current = window.location.hash.slice(1)

    this.matched = []
    this.match()

  }

  match(routes) {
    routes = routes || this.options.routes

    // 递归遍历
    for (const route of routes) {
      if (route.path === '/' && this.current === '/ ') {
        this.matched.push(route)
        return
      }

      if (route.path !== '/' && this.current.indexOf(route.path) !== -1) {
        this.matched.push(route)
        if (route.children.length > 0) {
          this.match(route)
        }

        return
      }
    }
  }
}

VueRouter.install = function (_Vue) {
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
      return h('a', { attrs: { href: '#' + this.to } }, this.$slots.default)
    },
  })

  Vue.component('router-view', {
    render(h) {
      // 标记routerView
      this.$vnode.data.routerView = true

      let depth = 0
      let parent = this.$parent

      while (parent) {
        const vnodeData = parent.$vnode && parent.$vnode.data

        if (vnodeData) {
          if (vnodeData.routerView) {
            depth++
          }
        }

        parent = parent.$parent
      }

      let Component = null
      const route = this.$router.matched[depth]
      if (route) {
        Component = route.component
      }
      return h(Component)
    },
  })
}

export default VueRouter
