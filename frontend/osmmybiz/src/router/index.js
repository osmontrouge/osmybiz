import Vue from 'vue'
import Router from 'vue-router'
import TestPage from '@/pages/testPage'
import LandingPage from '@/pages/landingPage'
import NominatimPage from '@/pages/nominatimPage'
import DetailPage from '@/pages/detailPage'

Vue.use(Router)

export const routes = {
  Landing: 'Landing',
  Detail: 'Detail'
}

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
    }, {
      path: '/detail',
      name: 'Detail',
      component: DetailPage
    }
  ]
})
