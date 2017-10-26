import osmApi from './../api/osmApi'
import tags from '../assets/tags_de.json'
import {LatLngRoundingAccuracy} from '../constants'
import {reverseQuery} from '../api/nominatimApi'

const options = []

options.push({
  value: 0,
  text: 'Eigene Kategorie wählen'
})

Object.keys(tags).forEach(function (key) {
  options.push({
    value: key,
    text: tags[key]
  })
})

const infoMap = new Map()
infoMap.set('category', 'Text about category')
infoMap.set('name', 'Text about name')
infoMap.set('openinghours', 'Text about openinghours')
infoMap.set('phonenumber', 'Text about phonenumber')
infoMap.set('email', 'Text about email')
infoMap.set('website', 'Text about website')
infoMap.set('wheelchair', 'Text about wheelchair')
infoMap.set('description', 'Text about description')
infoMap.set('note', 'Text about note')

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
  displaySuccess: false,
  displayConfirmation: true,
  isOwnCategory: false,
  isPopup: false,
  infoText: '',
  infoMap: infoMap,
  address: {}
}

const actions = {
  postNote ({commit}) {
    let note = constructNote()
    osmApi.post_Note(note).then(ps => {
      state.displaySuccess = true
      commit('setNote', ps)
    })
  },
  getAddress ({commit}) {
    reverseQuery(state.lat.toFixed(LatLngRoundingAccuracy), state.lon.toFixed(LatLngRoundingAccuracy)).then(ps => {
      commit('setAddress', ps)
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
  setDisplayConfirmation (state, displayConfirmation) {
    state.displayConfirmation = displayConfirmation
  },
  setIsOwnCategory (state, isOwnCategory) {
    state.isOwnCategory = isOwnCategory
  },
  setIsPopup (state, isPopup) {
    state.isPopup = isPopup
  },
  setCoords (state, pos) {
    state.lat = pos.lat
    state.lon = pos.lng
  },
  setInfoText (state, infoText) {
    state.infoText = infoText
  },
  setAddress (state, address) {
    state.address = address
  },
  setDetails (state, details) {
    state.details = details
  }
}

const getters = {
  lat (state) {
    return state.lat.toFixed(LatLngRoundingAccuracy)
  },
  lon (state) {
    return state.lon.toFixed(LatLngRoundingAccuracy)
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
  displayConfirmation (state) {
    return state.displayConfirmation
  },
  isOwnCategory (state) {
    return state.isOwnCategory
  },
  isPopup (state) {
    return state.isPopup
  },
  tags (state) {
    return state.tags
  },
  infoText (state) {
    return state.infoText
  },
  infoMap (state) {
    return state.infoMap
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}

function constructNote () {
  let text = 'Note from OSM My Business:\n'

  if (state.address.length !== 0) {
    let address = ''
    if (state.address.street) {
      address += state.address.street + ' '
    }
    if (state.address.housenumber) {
      address += state.address.housenumber + ', '
    }
    if (state.address.postcode) {
      address += state.address.postcode + ' '
    }
    if (state.address.city) {
      address += state.address.city + ', '
    }
    if (state.address.country) {
      address += state.address.country
    }
    text += 'Address: ' + address + '\n'
  }
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
