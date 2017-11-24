import Vuex from 'vuex'
import Vue from 'vue'
import test from './test'
import landing from './landing'
import nominatim from './nominatim'
import detail from './detail'
import auth from './auth'
import update from './update'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    test,
    auth,
    nominatim,
    detail,
    landing,
    update
  }
})
