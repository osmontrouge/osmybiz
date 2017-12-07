import Vuex from 'vuex'
import Vue from 'vue'
import test from './test'
import landing from './landing'
import detail from './detail'
import auth from './auth'
import locale from './locale'
import update from './update'
import error from './error'
import warning from './warning'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    test,
    auth,
    detail,
    landing,
    locale,
    update,
    error,
    warning
  }
})
