import Vue from 'vue'
import Vuex from './kvuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    add (state) {
      state.count++
    }
  },
  actions: {
    add ({ commit }) {
      commit('add')
    }
  },
  modules: {
  },
  getters: {
    doubleCount (state) {
      return state.count * 2
    }
  }
})
