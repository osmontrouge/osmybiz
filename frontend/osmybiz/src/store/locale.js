/* eslint-disable no-param-reassign */
import tagsEn from '../assets/tags/en.json';
import tagsDe from '../assets/tags/de.json';
import tagsFr from '../assets/tags/fr.json';
import tagsHe from '../assets/tags/he.json';
import tagsHu from '../assets/tags/hu.json';
import tagsIt from '../assets/tags/it.json';
import tagsPl from '../assets/tags/pl.json';
import tagsRu from '../assets/tags/ru.json';
import tagsSv from '../assets/tags/sv.json';
/* eslint-disable-next-line camelcase */
import tagsZh_TW from '../assets/tags/zh-TW.json';


export const FALLBACKLOCALE = 'en';

const SUPPORTEDLANGUAGESOPTIONS = {
  de: tagsDe,
  en: tagsEn,
  fr: tagsFr,
  he: tagsHe,
  hu: tagsHu,
  it: tagsIt,
  pl: tagsPl,
  ru: tagsRu,
  sv: tagsSv,
  /* eslint-disable-next-line camelcase */
  zh_TW: tagsZh_TW,
};

const FALLBACKTAGS = SUPPORTEDLANGUAGESOPTIONS[FALLBACKLOCALE];

const state = {
  languageTags: {},
};

const getters = {
  languageTags(s) {
    return s.languageTags;
  },
};

const mutations = {
  setTags(s, lng) {
    const tags = SUPPORTEDLANGUAGESOPTIONS[lng];
    Object.keys(FALLBACKTAGS).forEach((key) => {
      if (tags[key]) {
        s.languageTags[key] = tags[key];
      } else {
        s.languageTags[key] = FALLBACKTAGS[key];
      }
    });
    this.commit('setCategoryFields', s.languageTags);
  },
};

export function getTagName(tag) {
  return state.languageTags[tag] || tag;
}

export default {
  state,
  getters,
  mutations,
};
