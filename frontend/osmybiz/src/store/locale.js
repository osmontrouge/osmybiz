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
  tagOptions: [],
};

const getters = {
  languageTags(s) {
    return s.tags;
  },
  tagOptions(s) {
    return s.tagOptions;
  },
};


function generateTagsForCategoryField() {
  const options = [];
  Object.keys(state.languageTags).forEach((key) => {
    const fields = [];
    state.languageTags[key].fields.forEach((field) => {
      if (field.options) {
        const fieldOptions = [];
        Object.keys(field.options).forEach((option) => {
          fieldOptions.push({
            key: option,
            text: field.options[option],
          });
        });
        fields.push({
          key: field.key,
          label: field.label,
          type: field.type,
          options: fieldOptions,
          value: '',
        });
      } else {
        fields.push({
          key: field.key,
          label: field.label,
          type: field.type,
          value: '',
        });
      }
    });
    options.push({
      value: key,
      text: state.languageTags[key].name,
      fields,
    });
  });

  options.sort((a, b) => {
    if (a.text < b.text) return -1;
    if (a.text > b.text) return 1;
    return 0;
  });

  state.tagOptions = options;
}

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
    generateTagsForCategoryField();
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
