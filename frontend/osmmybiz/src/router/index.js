import Vue from 'vue'
import Router from 'vue-router'
import TestPage from '@/pages/testPage'
import LandingPage from '@/pages/landingPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Landing',
      component: LandingPage
    }, {
      path: '/test',
      name: 'Test',
      component: TestPage
    }
  ]
})
