import * as _ from 'lodash';
import { xml2json } from 'xml-js';
import { osmUrl } from '../config/config';

function parseDetails(businessPOITags) {
  const details = {};
  const tags = [
    'name',
    'opening_hours',
    'phone',
    'email',
    'website',
    'wheelchair',
    'description',
    'note',
  ];

  Object.keys(businessPOITags).forEach((key) => {
    tags.forEach((tag) => {
      if (tag === key) {
        details[tag] = businessPOITags[key];
      }
    });
  });

  return details;
}

function parseAddress(businessPOITags) {
  const address = {};
  const tags = [{
    k: 'addr:street',
    v: 'street',
  }, {
    k: 'addr:housenumber',
    v: 'housenumber',
  }, {
    k: 'addr:place',
    v: 'place',
  }, {
    k: 'addr:postcode',
    v: 'postcode',
  }, {
    k: 'addr:city',
    v: 'city',
  }];

  Object.keys(businessPOITags).forEach((key) => {
    tags.forEach((tag) => {
      if (tag.k === key) {
        address[tag.v] = businessPOITags[key];
      }
    });
  });

  return address;
}

function getText(obj) {
// eslint-disable-next-line no-underscore-dangle
  return obj._text;
}

function isIterable(obj) {
  // checks for null and undefined
  if (obj == null) {
    return false;
  }
  return typeof obj[Symbol.iterator] === 'function';
}

function extractLanguages(userJson) {
  const langs = userJson.languages.lang;
  if (!isIterable(langs)) {
    return [langs];
  }
  const languages = [];
  langs.forEach((l) => {
    languages.push(getText(l).slice(0, 2));
  });
  if (languages.length === 0) {
    languages.push('de');
  }
  return _.uniq(languages);
}

function getAttributes(obj) {
// eslint-disable-next-line no-underscore-dangle
  return obj._attributes;
}

function parseUser(userXml) {
  const xml = userXml.getElementsByTagName('osm')[0].innerHTML;
  const userJson = JSON.parse(xml2json(xml, { compact: true })).user;

  const languages = extractLanguages(userJson);

  return {
    name: getAttributes(userJson).display_name,
    id: parseInt(getAttributes(userJson).id, 10),
    unReadCount: getAttributes(userJson.messages.received).unread,
    langPrefs: languages,
  };
}

function createAddressTags(businessPOI) {
  let text = '';
  if (businessPOI.address.street) {
    text += `<tag k="addr:street" v="${businessPOI.address.street}"/>`;
    if (businessPOI.address.housenumber) {
      text += `<tag k="addr:housenumber" v="${businessPOI.address.housenumber}"/>`;
    }
  }
  if (businessPOI.address.place) {
    text += `<tag k="addr:place" v="${businessPOI.address.place}"/>`;
  }
  if (businessPOI.address.postcode) {
    text += `<tag k="addr:postcode" v="${businessPOI.address.postcode}"/>`;
  }
  if (businessPOI.address.city) {
    text += `<tag k="addr:city" v="${businessPOI.address.city}"/>`;
  }
  return text;
}

function createDetailTags(businessPOI) {
  let text = '';
  if (businessPOI.details.opening_hours.length !== 0) {
    text += `<tag k="opening_hours" v="${businessPOI.details.opening_hours}"/>`;
  }
  if (businessPOI.details.phone.length !== 0) {
    text += `<tag k="phone" v="${businessPOI.details.phone}"/>`;
  }
  if (businessPOI.details.email.length !== 0) {
    text += `<tag k="email" v="${businessPOI.details.email}"/>`;
  }
  if (businessPOI.details.website.length !== 0) {
    text += `<tag k="website" v="${businessPOI.details.website}"/>`;
  }
  if (businessPOI.details.wheelchair.length !== 0) {
    text += `<tag k="wheelchair" v="${businessPOI.details.wheelchair}"/>`;
  }
  if (businessPOI.details.description.length !== 0) {
    text += `<tag k="description" v="${businessPOI.details.description}"/>`;
  }
  if (businessPOI.details.note.length !== 0) {
    text += `<tag k="note" v="${businessPOI.details.note}"/>`;
  }

  if (businessPOI.details.category.fields) {
    businessPOI.details.category.fields.forEach((field) => {
      if (field.value.length !== 0) {
        text += `<tag k="${field.key}" v="${field.value}"/>`;
      }
    });
  }

  return text;
}

function constructUpload(businessPOI, changeSetId) {
  let xml = `${'' +
    '<osmChange version="0.6" generator="OSMyBiz">' +
    '<create>' +
    '<node id="-1" version="0"' +
    ' lat="'}${businessPOI.lat}"` +
    ` lon="${businessPOI.lon}"` +
    ` changeset="${changeSetId}">` +
    `<tag k="name" v="${businessPOI.details.name}"/>`;

  if (businessPOI.details.category.value !== 0) {
    const category = businessPOI.details.category.value.split('/');
    xml += `<tag k="${category[0]}" v="${category[1]}"/>`;
  }

  xml += createAddressTags(businessPOI);

  xml += createDetailTags(businessPOI);

  xml += '</node>' +
    '</create>' +
    '</osmChange>';

  return xml;
}

function parseTags(businessPOIJson) {
  const tags = businessPOIJson.tag;
  const result = {};
  tags.forEach((t) => {
    const tagAttributes = getAttributes(t);
    result[tagAttributes.k] = tagAttributes.v;
  });
  return result;
}

function parseNoteStatus(noteXml) {
  /* eslint-disable-next-line */
  return JSON.parse(xml2json(noteXml.data, { compact: true })).osm.note.status._text;
}

function parseBusinessPOI(businessPOIXml, osmType) {
  let businessPOIJson;
  if (typeof businessPOIXml === 'string') {
    businessPOIJson = JSON.parse(xml2json(businessPOIXml, { compact: true })).osm[osmType];
  } else {
    const xml = businessPOIXml.getElementsByTagName('osm')[0].innerHTML;
    businessPOIJson = JSON.parse(xml2json(xml, { compact: true })).node;
  }

  const businessPOIAttributes = getAttributes(businessPOIJson);

  const tags = parseTags(businessPOIJson);

  const address = parseAddress(tags);
  const details = parseDetails(tags);

  return {
    id: businessPOIAttributes.id,
    lat: businessPOIAttributes.lat,
    lon: businessPOIAttributes.lon,
    // KEITH
    link: `${osmUrl}/${osmType}/${businessPOIAttributes.id}/#map=19/${businessPOIAttributes.lat}/${businessPOIAttributes.lon}&layers=D`,
    address,
    details,
    version: businessPOIAttributes.version,
    changeSet: businessPOIAttributes.changeset,
    tags,
  };
}

function extractId(businessPOIDiff) {
  const xml = businessPOIDiff.getElementsByTagName('diffResult')[0].innerHTML;
  const diffJson = JSON.parse(xml2json(xml, { compact: true })).node;

  return getAttributes(diffJson).new_id;
}


export default {
  parseUser,
  constructUpload,
  parseBusinessPOI,
  extractId,
  parseNoteStatus,
};
