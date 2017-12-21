import * as $ from 'jquery';
// import * as _ from 'lodash';

function parseDetails(node) {
  const details = {};
  const tags = [{
    k: 'name',
  }, {
    k: 'opening_hours',
  }, {
    k: 'phone',
  }, {
    k: 'email',
  }, {
    k: 'website',
  }, {
    k: 'wheelchair',
  }, {
    k: 'description',
  }, {
    k: 'note',
  }];

  node.tag.forEach((nodeTag) => {
    tags.forEach((tag) => {
      if (tag.k === nodeTag.$.k) {
        details[tag.k] = nodeTag.$.v;
      }
    });
  });

  return details;
}

function parseAddress(node) {
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

  node.tag.forEach((nodeTag) => {
    tags.forEach((tag) => {
      if (tag.k === nodeTag.$.k) {
        address[tag.v] = nodeTag.$.v;
      }
    });
  });

  return address;
}

// function extractLanguages(langDoc) {
//   const childNodes = langDoc.children();
//   const languages = [];
//   childNodes.forEach((node) => {
//     const text = $(node).text();
//     languages.push(text.slice(0, 2));
//   });
//   if (languages.length === 0) {
//     languages.push('de');
//   }
//   return _.uniq(languages);
// }

function parseUser(userXml) {
  const doc = $(userXml);
  const user = doc.find('user');
  const messages = user.find('messages').find('received');
  // const languages = user.find('languages');
  return {
    name: user.attr('display_name'),
    id: parseInt(user.attr('id'), 10),
    unReadCount: messages.attr('unread'),
    langPrefs: [],
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

function parseTags(tags) {
  const res = {};
  tags.forEach((tag) => {
    res[tag.$.k] = tag.$.v;
  });
  return res;
}

function parseNode(node, osmUrl) {
  const address = parseAddress(node);
  const details = parseDetails(node);

  return {
    id: node.$.id,
    lat: node.$.lat,
    lon: node.$.lon,
    link: `${osmUrl}/node/${node.$.id}/#map=19/${node.$.lat}/${node.$.lon}&layers=D`,
    address,
    details,
    version: node.$.version,
    changeSet: node.$.changeset,
    tags: parseTags(node.tag),
  };
}


export default {
  parseUser,
  constructUpload,
  parseNode,
};
