import Vuex from 'vuex'
import Vue from 'vue'
import test from './test'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    test
  }
})
