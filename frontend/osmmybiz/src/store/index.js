import Vuex from 'vuex'
import Vue from 'vue'
import test from './test'
import landing from './landing'
import nominatim from './nominatim'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    test,
    landing,
    nominatim
  }
})
