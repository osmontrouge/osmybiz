import {getLanguageTags} from '../store/locale'

export function getTagName (tag) {
  let tags = getLanguageTags()
  return tags[tag] || tag
}
