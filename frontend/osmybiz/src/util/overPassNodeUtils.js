import { categoryTags } from '../api/overpassApi';
import { getTagName } from '../store/locale';

function getBusinessPOICategoryKey(businessPOI) {
  let result = '';
  categoryTags.forEach((t) => {
    if (businessPOI.tags[t]) {
      result = `${t}/${businessPOI.tags[t]}`;
    }
  });
  return result;
}

function getBizCategory(businessPOI) {
  const key = getBusinessPOICategoryKey(businessPOI);
  const fields = [];
  const tagFields = getTagName(key).fields || [];
  tagFields.forEach((field) => {
    let value = '';
    if (businessPOI.tags[field.key]) {
      value = businessPOI.tags[field.key];
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

function extractTag(businessPOI, tagName) {
  return businessPOI.tags[tagName] || '';
}

function extractWheelchair(businessPOI) {
  const value = businessPOI.tags.wheelchair;
  return value === 'yes' || value === 'limited';
}

function createNoteFromBusinessPOI(businessPOI) {
  return {
    category: getBizCategory(businessPOI),
    name: extractTag(businessPOI, 'name'),
    opening_hours: extractTag(businessPOI, 'opening_hours'),
    opening_hours_url: extractTag(businessPOI, 'opening_hours_url'),
    phone: extractTag(businessPOI, 'phone'),
    email: extractTag(businessPOI, 'email'),
    website: extractTag(businessPOI, 'website'),
    wheelchair: extractWheelchair(businessPOI),
    description: extractTag(businessPOI, 'description'),
    note: '',
  };
}

export {
  getBusinessPOICategoryKey,
  getBizCategory,
  createNoteFromBusinessPOI,
};
