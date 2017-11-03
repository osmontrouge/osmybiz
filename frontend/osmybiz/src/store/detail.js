import osmApi from './../api/osmApi'
import tags from '../assets/tags_de.json'
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
  // detailPage
  displaySuccess: false,
  displayConfirmation: true,

  // DetailForm
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
  isOwnCategory: false,
  isLoading: true,
  isPopup: false,
  isComment: false,
  infoText: '',
  infoMap: infoMap,

  // PostNoteSuccess
  note: {},
  comment: {},
  displayNote: false,
  displayComment: false,

  // AddressConfirmation
  address: {},
  displayAddressForm: false
}

const actions = {
  postNote ({commit}) {
    let note = constructNote()
    osmApi.post_Note(note).then(ps => {
      state.displaySuccess = true
      state.displayNote = true
      commit('setNote', ps)
    })
  },
  postComment () {
    let comment = constructComment()
    state.comment = comment
    osmApi.post_Comment(state.note.id, comment).then(() => {
      state.displaySuccess = true
      state.displayNote = false
      state.displayComment = true
    })
  },
  getAddress ({commit}) {
    state.isLoading = true
    reverseQuery(state.lat, state.lon).then(ps => {
      state.isLoading = false
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
  setDisplayAddressForm (state, displayAddressForm) {
    state.displayAddressForm = displayAddressForm
  },
  setIsOwnCategory (state, isOwnCategory) {
    state.isOwnCategory = isOwnCategory
  },
  setIsPopup (state, isPopup) {
    state.isPopup = isPopup
  },
  setIsComment (state, isComment) {
    state.isComment = isComment
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
  comment (state) {
    return state.comment
  },
  displayNote (state) {
    return state.displayNote
  },
  displayComment (state) {
    return state.displayComment
  },
  displaySuccess (state) {
    return state.displaySuccess
  },
  displayConfirmation (state) {
    return state.displayConfirmation
  },
  displayAddressForm (state) {
    return state.displayAddressForm
  },
  isOwnCategory (state) {
    return state.isOwnCategory
  },
  isPopup (state) {
    return state.isPopup
  },
  isComment (state) {
    return state.isComment
  },
  tags (state) {
    return state.tags
  },
  infoText (state) {
    return state.infoText
  },
  infoMap (state) {
    return state.infoMap
  },
  isLoading (state) {
    return state.isLoading
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

function constructComment () {
  let text = 'Comment from OSM My Business: '

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
    text += 'Address: ' + address + ', '
  }
  if (state.details.category.text.length !== 0) {
    text += 'Category: ' + state.details.category.text + ', '
  }
  if (state.details.name.length !== 0) {
    text += 'Name: ' + state.details.name + ', '
  }
  if (state.details.openinghours.length !== 0) {
    text += 'Opening hours: ' + state.details.openinghours + ', '
  }
  if (state.details.phonenumber.length !== 0) {
    text += 'Phone number: ' + state.details.phonenumber + ', '
  }
  if (state.details.email.length !== 0) {
    text += 'Email: ' + state.details.email + ', '
  }
  if (state.details.website.length !== 0) {
    text += 'Website: ' + state.details.website + ', '
  }
  if (state.details.wheelchair === true) {
    text += 'Wheelchair accessible: Yes , '
  }
  if (state.details.description.length !== 0) {
    text += 'Description: ' + state.details.description + ', '
  }
  if (state.details.note.length > 0) {
    text += 'Note: ' + state.details.note + ', '
  }

  return text
}