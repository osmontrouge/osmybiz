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

export function setError(listOfKeyWithPlaceholders) {
  const key = listOfKeyWithPlaceholders[0];
  state.placeholders = listOfKeyWithPlaceholders.splice(1);
  state.errorMessageKey = key;
  state.isError = true;
  setTimeout(() => {
    state.isError = false;
  }, 5000);
}
