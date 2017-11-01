import {latLng} from 'leaflet'
import {query} from './../api/nominatimApi'
import * as _ from 'lodash'

const state = {
  initialPos: latLng(47.223490, 8.817737),  // Hsr
  initialZoom: 15,
  tileUrl: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',

  mapPosition: null,
  position: null,

  search: null,
  suggestions: []
}

const queryDebounceMs = 200
const queryMinLength = 3
const requestThrottleMs = 1000

function q (commit, search) {
  if (!_.isString(search) || search.length < queryMinLength) {
    commit('setSuggestions', [])
  } else {
    query(search).then(results => {
      commit('setSuggestions', results)
    })
  }
}

const queryFn = _.debounce(_.throttle(q, requestThrottleMs), queryDebounceMs)

const actions = {
  queryNominatim ({commit}, search) {
    queryFn(commit, search)
  }
}

const mutations = {
  setPosition (state, pos) {
    state.position = pos
  },
  setMapPosition (state, pos) {
    state.mapPosition = pos
    state.position = pos
  },
  setSearch (state, search) {
    state.search = search
  },
  setSuggestions (state, suggestions) {
    state.suggestions = suggestions
  },
  selectPoint (state, point) {
    state.suggestions = []
    state.search = point.name
  },
  resetSearch (state) {
    state.search = ''
    state.suggestions = []
  }
}

const getters = {

  initialPos (state) {
    return state.initialPos
  },
  initialZoom (state) {
    return state.initialZoom
  },
  attribution (state) {
    return state.attribution
  },
  tileUrl (state) {
    return state.tileUrl
  },
  searchText (state) {
    return state.search
  },
  suggestions (state) {
    return state.suggestions
  },
  position (state) {
    return state.position
  },
  mapPosition (state) {
    return state.mapPosition
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
