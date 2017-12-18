import Vue from 'vue';
import Router from 'vue-router';
import LandingPage from './../pages/landingPage.vue';
import DetailPage from './../pages/detailPage.vue';

Vue.use(Router);

export const routes = {
  Landing: 'Landing',
  Detail: 'Detail',
};

export default new Router({
  routes: [
    {
      path: '/:zoom?/:lat?/:lng?',
      name: 'Landing',
      component: LandingPage,
    }, {
      path: '/detail',
      name: 'Detail',
      component: DetailPage,
    },
  ],
});
