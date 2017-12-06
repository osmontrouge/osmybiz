import tagsDe from '../assets/tags/tags_de.json'
import tagsEn from '../assets/tags/tags_en.json'

const state = {
  language: 'de',
  languageTags: tagsDe
}

const mutations = {
  setLanguage (state, lng) {
    state.language = lng
  },
  setTags (state, lng) {
    let tags = {}
    switch (lng) {
      case 'de': tags = tagsDe
        break
      case 'en': tags = tagsEn
        break
    }
    state.languageTags = tags
  }
}

const getters = {
  language (state) {
    return state.language
  },
  languageTags (state) {
    return state.tags
  }
}

export function getLanguage () {
  return state.language
}

export function getLanguageTags () {
  return state.languageTags
}

export default {
  state,
  mutations,
  getters
}
