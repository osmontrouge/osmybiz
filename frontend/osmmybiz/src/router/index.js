import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import TestPage from '@/pages/testPage'
import NominatimPage from '@/pages/nominatimPage'
import DetailPage from '@/pages/detailPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
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
