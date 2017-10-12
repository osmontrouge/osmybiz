import Vuex from 'vuex'
import Vue from 'vue'
import test from './test'
import landing from './landing'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    test,
    landing
  }
})
