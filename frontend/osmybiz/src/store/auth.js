/* eslint-disable no-param-reassign */
import * as _ from 'lodash';
import { login, setOauthToken, loadUser, logout } from './../api/osmApi';


const state = {
  isLoggedIn: false,
  user: null,
};

const actions = {
  authenticate() {
    login();
  },
  setToken(token) {
    return setOauthToken(token);
  },
  loadUser({ commit }) {
    loadUser().then((user) => {
      commit('setUser', user);
    });
  },
};

const mutations = {
  setUser(s, user) {
    if (_.isObject(user)) {
      s.user = user;
      s.isLoggedIn = true;
    } else {
      s.isLoggedIn = false;
    }
  },
  logout(s) {
    logout();
    s.user = null;
    s.isLoggedIn = false;
  },
};

const getters = {
  user(s) {
    return s.user;
  },
  isLoggedIn(s) {
    return s.isLoggedIn;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
