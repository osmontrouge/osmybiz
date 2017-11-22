import osmApi from './../api/osmApi'
import tags from '../assets/tags_de.json'
import {reverseQuery} from '../api/nominatimApi'
import {infoTexts} from '../locales/de'

const options = []

Object.keys(tags).forEach(function (key) {
  var fields = []
  tags[key].fields.forEach(function (field) {
    if (field.options) {
      var options = []
      Object.keys(field.options).forEach(function (option) {
        options.push({
          key: option,
          text: field.options[option]
        })
      })
      fields.push({
        key: field.key,
        label: field.label,
        type: field.type,
        options: options,
        value: ''
      })
    } else {
      fields.push({
        key: field.key,
        label: field.label,
        type: field.type,
        value: ''
      })
    }
  })
  options.push({
    value: key,
    text: tags[key].name,
    fields: fields
  })
})

const infoMap = new Map()
infoMap.set('category', infoTexts.category)
infoMap.set('name', infoTexts.name)
infoMap.set('opening_hours', infoTexts.opening_hours)
infoMap.set('phone', infoTexts.phone)
infoMap.set('email', infoTexts.email)
infoMap.set('website', infoTexts.website)
infoMap.set('wheelchair', infoTexts.wheelchair)
infoMap.set('description', infoTexts.description)
infoMap.set('note', infoTexts.note)

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
      value: 0,
      fields: [
        {key: '', name: '', value: ''}
      ]
    },
    name: '',
    opening_hours: '',
    phone: '',
    email: '',
    website: '',
    wheelchair: '',
    description: '',
    note: ''
  },
  isOwnCategory: false,
  isLoading: true,
  isPopup: false,
  isNote: false,
  infoText: '',
  infoMap: infoMap,

  // PostNoteSuccess
  note: {},
  node: {},

  // AddressConfirmation
  address: {},
  displayAddressForm: false
}

const actions = {
  postNode ({commit}) {
    let node = {
      lat: state.lat,
      lon: state.lon,
      details: state.details,
      address: state.address
    }
    osmApi.post_Node(node).then(ps => {
      state.displaySuccess = true
      commit('setNode', ps)
      console.log(ps)
    })
  },
  postNote ({commit}) {
    let note = constructNote()
    osmApi.post_Note(note).then(ps => {
      state.displaySuccess = true
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
  setNode (state, node) {
    state.node = node
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
  setIsNote (state, isNote) {
    state.isNote = isNote
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
  node (state) {
    return state.node
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
  isNote (state) {
    return state.isNote
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
  if (state.details.opening_hours.length !== 0) {
    text += 'Opening hours: ' + state.details.opening_hours + '\n'
  }
  if (state.details.phone.length !== 0) {
    text += 'Phone number: ' + state.details.phone + '\n'
  }
  if (state.details.email.length !== 0) {
    text += 'Email: ' + state.details.email + '\n'
  }
  if (state.details.website.length !== 0) {
    text += 'Website: ' + state.details.website + '\n'
  }
  if (state.details.wheelchair !== 0) {
    text += 'Wheelchair accessible: ' + state.details.wheelchair + '\n'
  }
  if (state.details.description.length !== 0) {
    text += 'Description: ' + state.details.description + '\n'
  }
  if (state.details.note.length > 0) {
    text += 'Note: ' + state.details.note + '\n'
  }

  state.details.category.fields.forEach(function (field) {
    if (field.value.length !== 0) {
      text += field.name + ': ' + field.value + '\n'
    }
  })

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
  if (state.details.opening_hours.length !== 0) {
    text += 'Opening hours: ' + state.details.opening_hours + ', '
  }
  if (state.details.phone.length !== 0) {
    text += 'Phone number: ' + state.details.phone + ', '
  }
  if (state.details.email.length !== 0) {
    text += 'Email: ' + state.details.email + ', '
  }
  if (state.details.website.length !== 0) {
    text += 'Website: ' + state.details.website + ', '
  }
  if (state.details.wheelchair !== 0) {
    text += 'Wheelchair accessible: ' + state.details.wheelchair + ', '
  }
  if (state.details.description.length !== 0) {
    text += 'Description: ' + state.details.description + ', '
  }
  if (state.details.note.length > 0) {
    text += 'Note: ' + state.details.note + ', '
  }

  return text
}
