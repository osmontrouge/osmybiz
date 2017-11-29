import Vue from 'vue'
import Router from 'vue-router'
import TestPage from '@/pages/testPage'
import LandingPage from '@/pages/landingPage'
import DetailPage from '@/pages/detailPage'

Vue.use(Router)

export const routes = {
  Landing: 'Landing',
  Detail: 'Detail'
}

export default new Router({
  routes: [
    {
      path: '/:zoom?/:lat?/:lng?',
      name: 'Landing',
      component: LandingPage
    }, {
      path: '/test',
      name: 'Test',
      component: TestPage
    }, {
      path: '/detail',
      name: 'Detail',
      component: DetailPage
    }
  ]
})
