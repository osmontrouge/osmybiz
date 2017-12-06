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

export function getInfoTexts () {
  const infoMap = new Map()
  infoMap.set('category', _$translate.locale.infoTexts.category)
  infoMap.set('address', _$translate.locale.infoTexts.address)
  infoMap.set('name', _$translate.locale.infoTexts.name)
  infoMap.set('opening_hours', _$translate.locale.infoTexts.opening_hours)
  infoMap.set('phone', _$translate.locale.infoTexts.phone)
  infoMap.set('email', _$translate.locale.infoTexts.email)
  infoMap.set('website', _$translate.locale.infoTexts.website)
  infoMap.set('wheelchair', _$translate.locale.infoTexts.wheelchair)
  infoMap.set('description', _$translate.locale.infoTexts.description)
  infoMap.set('note', _$translate.locale.infoTexts.note)
  return infoMap
}
