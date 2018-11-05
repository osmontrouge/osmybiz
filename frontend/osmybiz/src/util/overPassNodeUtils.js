import { categoryTags } from '../api/overpassApi';
import { getTagName } from '../store/locale';

function getNodeCategoryKey(node) {
  let result = '';
  categoryTags.forEach((t) => {
    if (node.tags[t]) {
      result = `${t}/${node.tags[t]}`;
    }
  });
  return result;
}

function getBizCategory(node) {
  const key = getNodeCategoryKey(node);
  const fields = [];
  const tagFields = getTagName(key).fields || [];
  tagFields.forEach((field) => {
    let value = '';
    if (node.tags[field.key]) {
      value = node.tags[field.key];
    }
    if (field.options) {
      const options = [];
      Object.keys(field.options).forEach((option) => {
        options.push({
          key: option,
          text: field.options[option],
        });
      });
      fields.push({
        key: field.key,
        label: field.label,
        type: field.type,
        options,
        value,
      });
    } else {
      fields.push({
        key: field.key,
        label: field.label,
        type: field.type,
        value,
      });
    }
  });
  return {
    text: getTagName(key).name,
    fields,
    value: key,
  };
}

function extractTag(node, tagName) {
  return node.tags[tagName] || '';
}

function extractWheelchair(node) {
  const value = node.tags.wheelchair;
  return value === 'yes' || value === 'limited';
}

function createNoteFromNode(node) {
  return {
    category: getBizCategory(node),
    name: extractTag(node, 'name'),
    opening_hours: extractTag(node, 'opening_hours'),
    phone: extractTag(node, 'phone'),
    email: extractTag(node, 'email'),
    website: extractTag(node, 'website'),
    wheelchair: extractWheelchair(node),
    description: extractTag(node, 'description'),
    note: '',
  };
}

export {
  getNodeCategoryKey,
  getBizCategory,
  createNoteFromNode,
};
