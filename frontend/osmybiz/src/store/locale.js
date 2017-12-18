/* eslint-disable no-param-reassign */
import tagsDe from '../assets/tags/de.json';
import tagsEn from '../assets/tags/en.json';

const state = {
  language: 'de',
  languageTags: tagsDe,

  $translate: {},
};

const mutations = {
  setLanguage(s, lng) {
    s.language = lng;
  },
  setTags(s, lng) {
    switch (lng) {
      case 'de': s.languageTags = tagsDe;
        break;
      case 'en': s.languageTags = tagsEn;
        break;
      default:
        s.languageTags = tagsDe;
    }
  },
};

const getters = {
  language(s) {
    return s.language;
  },
  languageTags(s) {
    return s.tags;
  },
};

export function getLanguage() {
  return state.language;
}

export function getLanguageTags() {
  return state.languageTags;
}

export default {
  state,
  mutations,
  getters,
};
