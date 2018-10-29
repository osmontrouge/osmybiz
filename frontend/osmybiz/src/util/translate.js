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
