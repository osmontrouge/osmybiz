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
    wheelchair: false,
    description: ''
  },
  note: {},
  displaySuccess: false
}

const actions = {
  postNote ({commit}) {
    let note = constructNote()
    osmApi.postNote(note).then(ps => {
      setDisplaySuccess()
      commit('setNote', ps)
    })
  }
}

const mutations = {
  setNote (state, note) {
    state.note = note
  },
  setDisplaySuccess (state, displaySuccess) {
    state.displaySuccess = displaySuccess
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
  },
  note (state) {
    return state.note
  },
  displaySuccess (state) {
    return state.displaySuccess
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}

function setDisplaySuccess () {
  state.displaySuccess = true
}

function constructNote () {
  var text = 'Note from OSM My Business:\n'

  if (state.details.category.text.length !== 0) {
    text += 'Category: ' + state.details.category.text + '\n'
  }
  if (state.details.name.length !== 0) {
    text += 'Name: ' + state.details.name + '\n'
  }
  if (state.details.openinghours.length !== 0) {
    text += 'Opening hours: ' + state.details.openinghours + '\n'
  }
  if (state.details.phonenumber.length !== 0) {
    text += 'Phone number: ' + state.details.phonenumber + '\n'
  }
  if (state.details.email.length !== 0) {
    text += 'Email: ' + state.details.email + '\n'
  }
  if (state.details.website.length !== 0) {
    text += 'Website: ' + state.details.website + '\n'
  }
  if (state.details.wheelchair === true) {
    text += 'Wheelchair accessible: Yes \n'
  }
  if (state.details.description.length !== 0) {
    text += 'Description: ' + state.details.description + '\n'
  }

  return {
    lat: state.lat,
    lon: state.lon,
    text: text
  }
}
