import osmAuth from 'osm-auth'
import * as $ from 'jquery'
import * as _ from 'lodash'

// todo move to config
const urlBase = 'https://master.apis.dev.openstreetmap.org'

const createNotePath = '/api/0.6/notes.json'
const createChangesetPath = '/api/0.6/changeset/create'
const uploadChangesetPath = '/api/0.6/changeset/'
const closeChangesetPath = '/api/0.6/changeset/'
const userPath = '/api/0.6/user/details.json'

let changesetID = 0

// prod keys move to config
// const oauthKey = 'deem7DGxX11rEQZ1SjYQ2lL0O9JCCNtqBzFUePjA'
// const oauthSecret = 'umPZIExDrNP4KvcXkhwBNIlH9J8jByPSCSwwL4w9'

// dev keys move to config
const oauthKey = 'IRTx85wq5Mv1TT7gt6iJ1KbPJiUyMmASB8jfuRCK'
const oauthSecret = 'tLZgaEwwAHn1eXoc79rsDLqdAwjHCi0Lh38T7ki7'

const auth = osmAuth({
  oauth_consumer_key: oauthKey,
  oauth_secret: oauthSecret,
  auto: false,
  url: urlBase,
  landing: '/',
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
  auth.authenticate()
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
          console.log(err)
          resolve(null)
        }
        resolve(parseUser(response))
      })
    }
  })
}

export default {

  post_Node: (node) => {
    let create =
      '<osm>' +
        '<changeset>' +
          '<tag k="comment" v="#OsMyBiz"/>' +
          '<tag k="created_by" v="OSMyBiz"/>' +
          '<tag k="changesets_count" v="1"/>' +
        '</changeset>' +
      '</osm>'
    return new Promise(() => {
      auth.xhr(
        {
          method: 'PUT',
          path: createChangesetPath,
          content: create,
          options: {
            header: {
              'Content-Type': 'text/xml'
            }
          }
        }, (err, response) => {
        if (err) {
          console.log(err)
        }
        changesetID = response
        uploadChangeset(node)
      })
    })
  },

  post_Note: (note) => {
    return new Promise((resolve) => {
      auth.xhr(
        {
          method: 'POST',
          path: createNotePath,
          content: 'lat=' + note.lat + '&lon=' + note.lon + '&text=' + note.text
        }, (err, response) => {
        if (err) {
          console.log(err)
          resolve(null)
        }
        const data = JSON.parse(response)
        resolve({
          html: data.properties.comments[0].html,
          id: data.properties.id,
          status: data.properties.status
        })
      })
    })
  }

  /* post_Comment: (id, comment) => {
    return axios.post(urlComment + id + '/comment?text=' + comment)
      .catch(e => {
        console.log(e)
      })
  } */
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
        console.log(err)
        resolve(null)
      }
      console.log(response)
        var x2js = new X2JS();
      console.log($.xml2json(response))
      closeChangeset()
    })
  })
}

function constructUpload (node) {
  let category = node.details.category.value.split('/')
  return '' +
    '<osmChange version="0.6" generator="OSMyBiz">' +
      '<create>' +
        '<node id="-1" version="0"' +
            ' lat="' + node.lat + '"' +
            ' lon="' + node.lon + '"' +
            ' changeset="' + changesetID + '">' +
          '<tag k="' + category[0] + '" v="' + category[1] + '"/>' +
          '<tag k="addr:street" v="' + node.address.street + '"/>' +
          '<tag k="addr:postcode" v="' + node.address.postcode + '"/>' +
          '<tag k="addr:city" v="' + node.address.city + '"/>' +
        '</node>' +
      '</create>' +
    '</osmChange>'
}

function closeChangeset () {
  auth.xhr(
    {
      method: 'PUT',
      path: closeChangesetPath + changesetID + '/close'
    }, (err) => {
    if (err) {
      console.log(err)
    }
  })
}
