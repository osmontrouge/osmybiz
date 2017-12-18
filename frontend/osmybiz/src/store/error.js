/* eslint-disable no-param-reassign */
const state = {
  error: '',
  isError: false,
};

const actions = {};

const mutations = {
};

const getters = {
  error(s) {
    return s.error;
  },
  isError(s) {
    return s.isError;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};

export function setError(error) {
  state.isError = true;
  state.error = error;
  setTimeout(() => {
    state.isError = false;
  }, 5000);
}
