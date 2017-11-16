import axios from 'axios'
import * as osmAuth from 'osm-auth'
// import * as $ from 'jquery'

// todo move to config
const urlBase = 'https://master.apis.dev.openstreetmap.org'

let urlNote = urlBase + '/api/0.6/notes.json'
let urlComment = urlBase + '/api/0.6/notes/'
const userPath = '/api/0.6/user/details.json'

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

function parseUser (userXml) {
  // const doc = $.parseXML(userXml)
  //
  // console.log(doc)

  return {
    name: '',
    id: '',
    unReadCound: 0
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
        console.log(response)
        resolve(parseUser(response))
      })
    }
  })
}

export default {

  post_Note: (note) => {
    return axios.post(urlNote, note)
      .then(response => {
        return {
          html: response.data.properties.comments[0].html,
          id: response.data.properties.id,
          status: response.data.properties.status
        }
      })
      .catch(e => {
        console.log(e)
      })
  },

  post_Comment: (id, comment) => {
    return axios.post(urlComment + id + '/comment?text=' + comment)
      .catch(e => {
        console.log(e)
      })
  }
}
