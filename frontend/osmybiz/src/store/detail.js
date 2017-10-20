import osmApi from './../api/osmApi'
import tags from '../assets/tags_de.json'

const options = []
Object.keys(tags).forEach(function (key) {
  options.push({
    value: key,
    text: tags[key]
  })
})

const state = {
  tags: options,
  lat: null,
  lon: null,
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
    description: '',
    note: ''
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
  },
  setCoords (state, pos) {
    state.lat = pos.lat
    state.lon = pos.lng
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
  },
  tags (state) {
    return state.tags
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

  if (state.details.note.length > 0) {
    text += 'Note: ' + state.details.note + '\n'
  }

  return {
    lat: state.lat,
    lon: state.lon,
    text: text
  }
}
