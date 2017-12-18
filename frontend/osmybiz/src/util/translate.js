import { getLanguageTags } from '../store/locale';

let $translate;

export function init(translate) {
  $translate = translate;
}

export function get() {
  return $translate;
}

export function getTagName(tag) {
  const tags = getLanguageTags();
  return tags[tag] || tag;
}

export function getInfoTexts() {
  const infoMap = new Map();
  infoMap.set('category', $translate.locale.infoTexts.category);
  infoMap.set('address', $translate.locale.infoTexts.address);
  infoMap.set('name', $translate.locale.infoTexts.name);
  infoMap.set('opening_hours', $translate.locale.infoTexts.opening_hours);
  infoMap.set('phone', $translate.locale.infoTexts.phone);
  infoMap.set('email', $translate.locale.infoTexts.email);
  infoMap.set('website', $translate.locale.infoTexts.website);
  infoMap.set('wheelchair', $translate.locale.infoTexts.wheelchair);
  infoMap.set('description', $translate.locale.infoTexts.description);
  infoMap.set('note', $translate.locale.infoTexts.note);
  return infoMap;
}
