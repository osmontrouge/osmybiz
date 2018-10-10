/* eslint-disable no-param-reassign */
import tagsEn from '../assets/tags/en.json';

const state = {
  language: 'en',
  languageTags: tagsEn,
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
