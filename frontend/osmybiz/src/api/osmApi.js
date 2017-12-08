import {osmUrl, osmApiLevel, oauthKey, oauthSecret} from '../config/config'
import osmAuth from 'osm-auth'
import * as $ from 'jquery'
import * as _ from 'lodash'
import xml2json from 'jquery-xml2json'
import {setError} from '../store/error'
import axios from 'axios'
import {get} from '../util/translate'

const createNotePath = osmApiLevel + 'notes.json'
const createChangesetPath = osmApiLevel + 'changeset/create'
const uploadChangesetPath = osmApiLevel + 'changeset/'
const closeChangesetPath = osmApiLevel + 'changeset/'
const getNodePath = osmApiLevel + 'node/'
const userPath = osmApiLevel + 'user/details.json'

let changesetID = 0

const auth = osmAuth({
  oauth_consumer_key: oauthKey,
  oauth_secret: oauthSecret,
  auto: false,
  url: osmUrl,
  landing: location.pathname,
  singlepage: true
})

function extractLanguages (langDoc) {
  const childNodes = langDoc.children()
  const languages = []
  for (const node of childNodes) {
    const text = $(node).text()
    languages.push(text.slice(0, 2))
  }
  if (languages.length === 0) {
    // todo extract to config (defaultlanguage)
    languages.push('de')
  }
  return _.uniq(languages)
}

function parseUser (userXml) {
  const doc = $(userXml)
  const user = doc.find('user')
  const messages = user.find('messages').find('received')
  const languages = user.find('languages')
  return {
    name: user.attr('display_name'),
    id: parseInt(user.attr('id')),
    unReadCount: messages.attr('unread'),
    langPrefs: extractLanguages(languages)
  }
}

export function login () {
  auth.authenticate(function () {
    setError(get().locale.error.osm.login)
  })
}

export function isLoggedIn () {
  return auth.authenticated()
}

export function setOauthToken (token) {
  return new Promise((resolve) => {
    auth.bootstrapToken(token, () => {
      resolve(true)
    })
  })
}

export function logout () {
  auth.logout()
}

export function loadUser () {
  return new Promise((resolve) => {
    if (!isLoggedIn()) {
      resolve(null)
    } else {
      auth.xhr({method: 'GET', path: userPath}, (err, response) => {
        if (err) {
          setError(get().locale.error.osm.loadUser)
          console.log(err)
          resolve(null)
        }
        resolve(parseUser(response))
      })
    }
  })
}

export function postNode (node) {
  let create =
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
        method: 'PUT',
        path: createChangesetPath,
        content: create,
        options: {
          header: {
            'Content-Type': 'text/xml'
          }
        }}, (err, response) => {
      if (err) {
        setError(get().locale.error.osm.postNode)
        console.log(err)
      }
      changesetID = response
      resolve(uploadChangeset(node))
    })
  })
}

export function postNote (note) {
  return new Promise((resolve) => {
    auth.xhr(
      {
        method: 'POST',
        path: createNotePath,
        content: 'lat=' + note.lat + '&lon=' + note.lon + '&text=' + note.text
      }, (err, response) => {
      if (err) {
        setError(get().locale.error.osm.postNote)
        console.log(err)
        resolve(null)
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
  let left = lng - 0.00005
  let bottom = lat - 0.00005
  let right = lng + 0.00005
  let top = lat + 0.00005
  return new Promise((resolve) => {
    auth.xhr(
      {
        method: 'GET',
        path: createNotePath + '?bbox=' + left + ',' + bottom + ',' + right + ',' + top
      }, (err, response) => {
      if (err) {
        setError(get().error.osm.load)
        console.log(err)
        resolve(null)
      }
      const data = JSON.parse(response)
      resolve(data.features)
    })
  })
}

function uploadChangeset (node) {
  let upload = constructUpload(node)
  return new Promise((resolve) => {
    auth.xhr(
      {
        method: 'POST',
        path: uploadChangesetPath + changesetID + '/upload',
        content: upload,
        options: {
          header: {
            'Content-Type': 'text/xml'
          }
        }
      }, (err, response) => {
      if (err) {
        setError(get().locale.error.osm.load)
        console.log(err)
        resolve(null)
      }
      closeChangeset()
      resolve(getNode(xml2json(response)['#document'].diffResult.node.$.new_id))
    })
  })
}

function constructUpload (node) {
  let category = node.details.category.value.split('/')
  let xml = '' +
    '<osmChange version="0.6" generator="OSMyBiz">' +
    '<create>' +
    '<node id="-1" version="0"' +
    ' lat="' + node.lat + '"' +
    ' lon="' + node.lon + '"' +
    ' changeset="' + changesetID + '">' +
    '<tag k="' + category[0] + '" v="' + category[1] + '"/>' +
    '<tag k="name" v="' + node.details.name + '"/>'

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

  node.details.category.fields.forEach(function (field) {
    if (field.value.length !== 0) {
      text += '<tag k="' + field.key + '" v="' + field.value + '"/>'
    }
  })

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
        path: getNodePath + nodeId
      }, (err, response) => {
      if (err) {
        if (err.status === 410) {
          resolve(null)
        } else if (err.status === 404) {
          getNode2(nodeId).then(res => {
            resolve(res)
          }).catch(() => {
            resolve(null)
          })
        } else {
          setError(get().locale.error.osm.load)
          console.log(err)
          reject(err)
        }
      } else {
        resolve(parseNode(xml2json(response)['#document'].osm.node))
      }
    })
  })
}

function parseNode (node) {
  let address = parseAddress(node)
  let details = parseDetails(node)

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

function parseTags (tags) {
  const res = {}
  for (const tag of tags) {
    res[tag['$'].k] = tag['$'].v
  }
  return res
}

function parseAddress (node) {
  let address = {}
  const tags = [{
    k: 'addr:street',
    v: 'street'
  }, {
    k: 'addr:housenumber',
    v: 'housenumber'
  }, {
    k: 'addr:place',
    v: 'place'
  }, {
    k: 'addr:postcode',
    v: 'postcode'
  }, {
    k: 'addr:city',
    v: 'city'
  }]
  for (let nodeTag of node.tag) {
    for (let tag of tags) {
      if (tag.k === nodeTag.$.k) {
        address[tag.v] = nodeTag.$.v
      }
    }
  }
  return address
}

function parseDetails (node) {
  let details = {}
  const tags = [{
    k: 'name'
  }, {
    k: 'opening_hours'
  }, {
    k: 'phone'
  }, {
    k: 'email'
  }, {
    k: 'website'
  }, {
    k: 'wheelchair'
  }, {
    k: 'description'
  }, {
    k: 'note'
  }]
  for (let nodeTag of node.tag) {
    for (let tag of tags) {
      if (tag.k === nodeTag.$.k) {
        details[tag.k] = nodeTag.$.v
      }
    }
  }
  return details
}
