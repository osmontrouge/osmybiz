import tagsDe from '../assets/tags/de.json'
import tagsEn from '../assets/tags/en.json'

const state = {
  language: 'de',
  languageTags: tagsDe,

  $translate: {},
};

const mutations = {
  setLanguage(s, lng) {
    s.language = lng;
  },
  setTags (state, lng) {
    switch (lng) {
      case 'de': state.languageTags = tagsDe
        break
      case 'en': state.languageTags = tagsEn
        break
      default:
        state.languageTags = tagsDe
    }
  }
}

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
