import {categoryTags} from '../api/overpassApi'
import {getTagName} from './translate'

export function getNodeCategoryKey (node) {
  for (const t of categoryTags) {
    if (node.tags.hasOwnProperty(t)) {
      return `${t}/${node.tags[t]}`
    }
  }
  return ''
}

function getBizCategory (node) {
  const key = getNodeCategoryKey(node)
  var fields = []
  getTagName(key).fields.forEach(function (field) {
    var value = ''
    if (node.tags[field.key]) {
      value = node.tags[field.key]
    }
    if (field.options) {
      var options = []
      Object.keys(field.options).forEach(function (option) {
        options.push({
          key: option,
          text: field.options[option]
        })
      })
      fields.push({
        key: field.key,
        label: field.label,
        type: field.type,
        options: options,
        value: value
      })
    } else {
      fields.push({
        key: field.key,
        label: field.label,
        type: field.type,
        value: value
      })
    }
  })
  return {
    text: getTagName(key).name,
    fields: fields,
    value: key
  }
}

function extractTag (node, tagName) {
  return node.tags[tagName] || ''
}

function extractWheelchair (node) {
  const value = node.tags['wheelchair']
  return value === 'yes' || value === 'limited'
}

export function createNoteFromNode (node) {
  return {
    category: getBizCategory(node),
    name: extractTag(node, 'name'),
    openinghours: extractTag(node, 'opening_hours'),
    phonenumber: extractTag(node, 'phone'),
    email: extractTag(node, 'email'),
    website: extractTag(node, 'website'),
    wheelchair: extractWheelchair(node),
    description: extractTag(node, 'description'),
    note: ''
  }
}
