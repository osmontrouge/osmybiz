import tags from '../assets/tags_de.json'

export function getTagName (tag) {
  return tags[tag] || tag
}
