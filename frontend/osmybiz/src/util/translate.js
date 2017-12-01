import {getLanguageTags} from '../store/locale'

let _$translate

export function init ($translate) {
  _$translate = $translate
}

export function get () {
  return _$translate
}

export function getTagName (tag) {
  let tags = getLanguageTags()
  return tags[tag] || tag
}
