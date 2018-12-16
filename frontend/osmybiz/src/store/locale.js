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
  categoryFields: [],
};

function getFieldOptions(field) {
  const fieldOptions = [];
  Object.keys(field.options).forEach((option) => {
    fieldOptions.push({
      key: option,
      text: field.options[option],
    });
  });
  return fieldOptions;
}

function getFields(category) {
  const fields = [];
  category.fields.forEach((field) => {
    const content = {
      key: field.key,
      label: field.label,
      type: field.type,
      value: '',
    };
    if (field.options) {
      content.options = getFieldOptions(field);
    }
    fields.push(content);
  });
  return fields;
}

function getCategoryOptions(languageTags) {
  const options = [];
  Object.keys(languageTags).forEach((key) => {
    options.push({
      value: key,
      text: languageTags[key].name,
      fields: getFields(languageTags[key]),
    });
  });
  return options;
}

const getters = {
  languageTags(s) {
    return s.languageTags;
  },
  categoryFields(s) {
    return s.categoryFields;
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
    const options = getCategoryOptions(s.languageTags);
    options.sort((a, b) => {
      if (a.text < b.text) return -1;
      if (a.text > b.text) return 1;
      return 0;
    });
    s.categoryFields = options;
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
