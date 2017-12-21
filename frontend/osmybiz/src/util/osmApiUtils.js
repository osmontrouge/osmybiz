import * as _ from 'lodash';
import { xml2json } from 'xml-js';

function parseDetails(nodeTags) {
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

  Object.keys(nodeTags).forEach((key) => {
    tags.forEach((tag) => {
      if (tag === key) {
        details[tag] = nodeTags[key];
      }
    });
  });

  return details;
}

function parseAddress(nodeTags) {
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

  Object.keys(nodeTags).forEach((key) => {
    tags.forEach((tag) => {
      if (tag.k === key) {
        address[tag.v] = nodeTags[key];
      }
    });
  });

  return address;
}

function getText(obj) {
// eslint-disable-next-line no-underscore-dangle
  return obj._text;
}

function extractLanguages(userJson) {
  const langs = userJson.languages.lang;

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

function createAddressTags(node) {
  let text = '';
  if (node.address.street) {
    text += `<tag k="addr:street" v="${node.address.street}"/>`;
    if (node.address.housenumber) {
      text += `<tag k="addr:housenumber" v="${node.address.housenumber}"/>`;
    }
  } else if (node.address.place) {
    text += `<tag k="addr:place" v="${node.address.place}"/>`;
  }
  if (node.address.postcode) {
    text += `<tag k="addr:postcode" v="${node.address.postcode}"/>`;
  }
  if (node.address.city) {
    text += `<tag k="addr:city" v="${node.address.city}"/>`;
  }
  return text;
}

function createDetailTags(node) {
  let text = '';
  if (node.details.opening_hours.length !== 0) {
    text += `<tag k="opening_hours" v="${node.details.opening_hours}"/>`;
  }
  if (node.details.phone.length !== 0) {
    text += `<tag k="phone" v="${node.details.phone}"/>`;
  }
  if (node.details.email.length !== 0) {
    text += `<tag k="email" v="${node.details.email}"/>`;
  }
  if (node.details.website.length !== 0) {
    text += `<tag k="website" v="${node.details.website}"/>`;
  }
  if (node.details.wheelchair.length !== 0) {
    text += `<tag k="wheelchair" v="${node.details.wheelchair}"/>`;
  }
  if (node.details.description.length !== 0) {
    text += `<tag k="description" v="${node.details.description}"/>`;
  }
  if (node.details.note.length !== 0) {
    text += `<tag k="note" v="${node.details.note}"/>`;
  }

  if (node.details.category.fields) {
    node.details.category.fields.forEach((field) => {
      if (field.value.length !== 0) {
        text += `<tag k="${field.key}" v="${field.value}"/>`;
      }
    });
  }

  return text;
}

function constructUpload(node, changeSetId) {
  let xml = `${'' +
    '<osmChange version="0.6" generator="OSMyBiz">' +
    '<create>' +
    '<node id="-1" version="0"' +
    ' lat="'}${node.lat}"` +
    ` lon="${node.lon}"` +
    ` changeset="${changeSetId}">` +
    `<tag k="name" v="${node.details.name}"/>`;

  if (node.details.category.value !== 0) {
    const category = node.details.category.value.split('/');
    xml += `<tag k="${category[0]}" v="${category[1]}"/>`;
  }

  xml += createAddressTags(node);

  xml += createDetailTags(node);

  xml += '</node>' +
    '</create>' +
    '</osmChange>';

  return xml;
}

function parseTags(nodeJson) {
  const tags = nodeJson.tag;
  const result = {};
  tags.forEach((t) => {
    const tagAttributes = getAttributes(t);
    result[tagAttributes.k] = tagAttributes.v;
  });
  return result;
}

function parseNode(nodeXml) {
  let nodeJson;
  if (typeof nodeXml === 'string') {
    nodeJson = JSON.parse(xml2json(nodeXml, { compact: true })).osm.node;
  } else {
    const xml = nodeXml.getElementsByTagName('osm')[0].innerHTML;
    nodeJson = JSON.parse(xml2json(xml, { compact: true })).node;
  }

  const nodeAttributes = getAttributes(nodeJson);

  const tags = parseTags(nodeJson);

  const address = parseAddress(tags);
  const details = parseDetails(tags);

  return {
    id: nodeAttributes.id,
    lat: nodeAttributes.lat,
    lon: nodeAttributes.lon,
    address,
    details,
    version: nodeAttributes.version,
    changeSet: nodeAttributes.changeset,
    tags,
  };
}

function extractId(nodeDiff) {
  const xml = nodeDiff.getElementsByTagName('diffResult')[0].innerHTML;
  const diffJson = JSON.parse(xml2json(xml, { compact: true })).node;

  return getAttributes(diffJson).new_id;
}


export default {
  parseUser,
  constructUpload,
  parseNode,
  extractId,
};
