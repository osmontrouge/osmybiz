import Vuex from 'vuex'
import Vue from 'vue'
import test from './test'
import nominatim from './nominatim'
import detail from './detail'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    test,
    nominatim,
    detail
  }
})
