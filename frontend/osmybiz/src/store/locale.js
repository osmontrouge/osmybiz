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

const state = {
  languageTags: tagsEn,
  $translate: {},
};

const getters = {
  languageTags(s) {
    return s.tags;
  },
};

const mutations = {
  setTags(s, lng) {
    switch (lng) {
      case 'de': s.languageTags = tagsDe;
        break;
      case 'en': s.languageTags = tagsEn;
        break;
      case 'fr': s.languageTags = tagsFr;
        break;
      case 'he': s.languageTags = tagsHe;
        break;
      case 'hu': s.languageTags = tagsHu;
        break;
      case 'it': s.languageTags = tagsIt;
        break;
      case 'pl': s.languageTags = tagsPl;
        break;
      case 'ru': s.languageTags = tagsRu;
        break;
      case 'sv': s.languageTags = tagsSv;
        break;
      /* eslint-disable-next-line camelcase */
      case 'zh_TW': s.languageTags = tagsZh_TW;
        break;
      default:
        s.languageTags = tagsEn;
    }
  },
};

export function getLanguageTags() {
  return state.languageTags;
}

export default {
  state,
  getters,
  mutations,
};
