/* eslint-disable no-param-reassign */
const state = {
  errorMessageKey: '',
  placeholders: [],
  isError: false,
};

const actions = {};

const mutations = {
};

const getters = {
  errorMessageKey(s) {
    return s.errorMessageKey;
  },
  placeholders(s) {
    return s.placeholders;
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

export function setError(errorObj) {
  state.errorMessageKey = errorObj.errorMessageKey;
  if (typeof errorObj.placeholders !== 'undefined') {
    state.placeholders = errorObj.placeholders;
  }
  state.isError = true;
  setTimeout(() => {
    state.isError = false;
  }, 5000);
}
