import axios from 'axios';
import osmAuth from 'osm-auth';
import xml2json from 'jquery-xml2json';
import { osmUrl, osmApiLevel, oauthKey, oauthSecret } from '../config/config';
import { setError } from '../store/error';
import { get } from '../util/translate';
import util from '../util/osmApiUtils';

const createNotePath = `${osmApiLevel}notes.json`;
const createChangesetPath = `${osmApiLevel}changeset/create`;
const uploadChangesetPath = `${osmApiLevel}changeset/`;
const closeChangesetPath = `${osmApiLevel}changeset/`;
const getNodePath = `${osmApiLevel}node/`;
const userPath = `${osmApiLevel}user/details.json`;

const auth = osmAuth({
  oauth_consumer_key: oauthKey,
  oauth_secret: oauthSecret,
  auto: false,
  url: osmUrl,
  landing: location.pathname,
  singlepage: true,
});


export function login() {
  auth.authenticate(() => {
    setError(get().locale.error.osm.login);
  });
}

export function isLoggedIn() {
  return auth.authenticated();
}

export function setOauthToken(token) {
  return new Promise((resolve) => {
    auth.bootstrapToken(token, () => {
      resolve(true);
    });
  });
}

export function logout() {
  auth.logout();
}

export function loadUser() {
  return new Promise((resolve) => {
    if (!isLoggedIn()) {
      resolve(null);
    } else {
      auth.xhr({ method: 'GET', path: userPath }, (err, response) => {
        if (err) {
          setError(get().locale.error.osm.loadUser);
          resolve(null);
        }
        resolve(util.parseUser(response));
      });
    }
  });
}

export function postNode (node) {
  const create =
      '<osm>' +
        '<changeset>' +
          '<tag k="comment" v="#OsMyBiz"/>' +
          '<tag k="created_by" v="OSMyBiz"/>' +
          '<tag k="changesets_count" v="1"/>' +
        '</changeset>' +
      '</osm>'
  return new Promise((resolve) => {
    auth.xhr(
      {
        method: 'GET',
        path: getNodePath + nodeId,
      }, (err, response) => {
      if (err) {
        if (err.status === 410) {
          resolve(null);
        } else if (err.status === 404) {
          getNode2(nodeId).then((res) => {
            resolve(res);
          }).catch(() => {
            resolve(null);
          });
        } else {
          setError(get().locale.error.osm.load);
          reject(err);
        }
      } else {
        resolve(util.parseNode(xml2json(response)['#document'].osm.node));
      }
    });
  });
}


function uploadChangeset(node, changeSetId) {
  const upload = util.constructUpload(node, changeSetId);
  return new Promise((resolve) => {
    auth.xhr(
      {
        method: 'POST',
        path: `${uploadChangesetPath + changeSetId}/upload`,
        content: upload,
        options: {
          header: {
            'Content-Type': 'text/xml',
          },
        },
      }, (err, response) => {
      if (err) {
        setError(get().locale.error.osm.load);
        resolve(null);
      }
      const data = JSON.parse(response)
      resolve({
        html: data.properties.comments[0].html,
        text: data.properties.comments[0].text,
        id: data.properties.id,
        link: osmUrl + '/note/' + data.properties.id + '/#map=19/' + data.geometry.coordinates[1] + '/' + data.geometry.coordinates[0] + '&layers=ND',
        status: data.properties.status
      })
    })
  })
}

export function getNotes (lat, lng) {
  const left = lng - 0.00005
  const bottom = lat - 0.00005
  const right = lng + 0.00005
  const top = lat + 0.00005
  return new Promise((resolve) => {
    auth.xhr(
      {
        method: 'PUT',
        path: createChangesetPath,
        content: create,
        options: {
          header: {
            'Content-Type': 'text/xml',
          },
        },
      }, (err, changeSetId) => {
      if (err) {
        setError(get().locale.error.osm.postNode);
      }
      resolve(uploadChangeset(node, changeSetId));
    });
  });
}

function uploadChangeset (node) {
  const upload = constructUpload(node)
  return new Promise((resolve) => {
    auth.xhr(
      {
        method: 'POST',
        path: createNotePath,
        content: `lat=${note.lat}&lon=${note.lon}&text=${note.text}`,
      }, (err, response) => {
      if (err) {
        setError(get().locale.error.osm.postNote);
        resolve(null);
      }
      closeChangeset()
      resolve(getNode(xml2json(response)['#document'].diffResult.node.$.new_id))
    })
  })
}

function constructUpload (node) {
  let xml = '' +
    '<osmChange version="0.6" generator="OSMyBiz">' +
    '<create>' +
    '<node id="-1" version="0"' +
    ' lat="' + node.lat + '"' +
    ' lon="' + node.lon + '"' +
    ' changeset="' + changesetID + '">' +
    '<tag k="name" v="' + node.details.name + '"/>'

  if (node.details.category.value !== 0) {
    const category = node.details.category.value.split('/')
    xml += '<tag k="' + category[0] + '" v="' + category[1] + '"/>'
  }

  xml += createAddressTags(node)

  xml += createDetailTags(node)

  xml += '</node>' +
    '</create>' +
    '</osmChange>'

  return xml
}

function createAddressTags (node) {
  let text = ''
  if (node.address.street) {
    text += '<tag k="addr:street" v="' + node.address.street + '"/>'
    if (node.address.housenumber) {
      text += '<tag k="addr:housenumber" v="' + node.address.housenumber + '"/>'
    }
  } else {
    if (node.address.place) {
      text += '<tag k="addr:place" v="' + node.address.place + '"/>'
    }
  }
  if (node.address.postcode) {
    text += '<tag k="addr:postcode" v="' + node.address.postcode + '"/>'
  }
  if (node.address.city) {
    text += '<tag k="addr:city" v="' + node.address.city + '"/>'
  }
  return text
}

function createDetailTags (node) {
  let text = ''
  if (node.details.opening_hours.length !== 0) {
    text += '<tag k="opening_hours" v="' + node.details.opening_hours + '"/>'
  }
  if (node.details.phone.length !== 0) {
    text += '<tag k="phone" v="' + node.details.phone + '"/>'
  }
  if (node.details.email.length !== 0) {
    text += '<tag k="email" v="' + node.details.email + '"/>'
  }
  if (node.details.website.length !== 0) {
    text += '<tag k="website" v="' + node.details.website + '"/>'
  }
  if (node.details.wheelchair.length !== 0) {
    text += '<tag k="wheelchair" v="' + node.details.wheelchair + '"/>'
  }
  if (node.details.description.length !== 0) {
    text += '<tag k="description" v="' + node.details.description + '"/>'
  }
  if (node.details.note.length !== 0) {
    text += '<tag k="note" v="' + node.details.note + '"/>'
  }

  if (node.details.category.fields) {
    node.details.category.fields.forEach(function (field) {
      if (field.value.length !== 0) {
        text += '<tag k="' + field.key + '" v="' + field.value + '"/>'
      }
    })
  }

  return text
}

function closeChangeset () {
  auth.xhr(
    {
      method: 'PUT',
      path: closeChangesetPath + changesetID + '/close'
    }, (err) => {
    if (err) {
      setError(get().locale.error.osm.load)
      console.log(err)
    }
  })
}

// temporary fix to redirect to live api, because dev environment is currentliy borken
function getNode2 (nodeId) {
  return axios.get(`https://api.openstreetmap.org/api/0.6/node/${nodeId}`).then(res => {
    const parsed = xml2json(res.data)
    return parseNode(parsed.osm.node)
  })
}

export function getNode (nodeId) {
  return new Promise((resolve, reject) => {
    auth.xhr(
      {
        method: 'GET',
        path: `${createNotePath}?bbox=${left},${bottom},${right},${top}`,
      }, (err, response) => {
      if (err) {
        setError(get().error.osm.load);
        resolve(null);
      }
    })
  })
}

function parseNode (node) {
  const address = parseAddress(node)
  const details = parseDetails(node)

  return {
    id: node.$.id,
    lat: node.$.lat,
    lon: node.$.lon,
    link: osmUrl + '/node/' + node.$.id + '/#map=19/' + node.$.lat + '/' + node.$.lon + '&layers=D',
    address: address,
    details: details,
    version: node.$.version,
    changeSet: node.$.changeset,
    tags: parseTags(node.tag)
  }
}

