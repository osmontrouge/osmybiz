import osmApi from './../api/osmApi'

const state = {
  lat: 47.0742031,
  lon: 9.1963728471363,
  details: {
    category: {
      text: '',
      value: 0
    },
    name: '',
    openinghours: '',
    phonenumber: '',
    email: '',
    website: '',
    description: ''
  }
}

const actions = {
  postNote () {
    let note = constructNote()
    console.log(note)
    osmApi.postNote(note).then(ps => {
      console.log(ps)
      // commit('setAddress', ps.data[0])
    })
  }
}

const mutations = {
  setLat (state, lat) {
    state.lat = lat
  },
  setLon (state, lon) {
    state.lon = lon
  }
}

const getters = {
  lat (state) {
    return state.lat
  },
  lon (state) {
    return state.lon
  },
  details (state) {
    return state.details
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}

function constructNote () {
  return {
    lat: state.lat,
    lon: state.lon,
    text: 'Note from OSM My Business:\n' +
   'Category: ' + state.details.category.text + '\n' +
   'Name: ' + state.details.name + '\n' +
   'Opening hours: ' + state.details.openinghours + '\n' +
   'Phone number: ' + state.details.phonenumber + '\n' +
   'Email: ' + state.details.email + '\n' +
   'Website: ' + state.details.website + '\n' +
   'Description: ' + state.details.description + '\n'
  }
}
