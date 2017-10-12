import Vue from 'vue'
import Router from 'vue-router'
import TestPage from '@/pages/testPage'
import LandingPage from '@/pages/landingPage'
import NominatimPage from '@/pages/nominatimPage'

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
    }, {
      path: '/nominatim',
      name: 'Nominatim',
      component: NominatimPage
    }
  ]
})
