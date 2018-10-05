/* eslint-disable no-param-reassign */
import tagsDe from '../assets/tags/de.json';

const state = {
  language: 'de',
  languageTags: tagsDe,
  $translate: {},
};

const getters = {
  language(s) {
    return s.language;
  },
  languageTags(s) {
    return s.tags;
  },
};

export function getLanguageTags() {
  return state.languageTags;
}

export default {
  state,
  getters,
};
