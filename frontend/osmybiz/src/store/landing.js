import {query} from './../api/nominatimApi'
import * as _ from 'lodash'
import {queryBox} from '../api/overpassApi'

const state = {
  mapPosition: null,
  position: null,

  search: null,
  suggestions: [],
  viewPort: null,

  businesses: [],
  mode: 'tiles'
}

const queryDebounceMs = 400
const queryMinLength = 3
const requestThrottleMs = 1000

const minZoomBusinesses = 18

function q (commit, search) {
  if (!_.isString(search) || search.length < queryMinLength) {
    commit('setSuggestions', [])
  } else {
    query(search).then(results => {
      commit('setSuggestions', results)
    })
  }
}

function qb (commit, viewPort) {
  if (viewPort.zoom < minZoomBusinesses) {
    commit('setBusinesses', [])
  } else {
    queryBox(viewPort.boundingBox).then(res => {
      commit('setBusinesses', res)
    })
  }
}

function convertToBoundingBox (topRight, bottomLeft) {
  return {
    south: bottomLeft.lat,
    west: bottomLeft.lng,
    north: topRight.lat,
    east: topRight.lng
  }
}

const queryFn = _.debounce(_.throttle(q, requestThrottleMs), queryDebounceMs)

const queryBoxFn = _.debounce(qb, queryDebounceMs)

const actions = {
  queryNominatim ({commit}, search) {
    queryFn(commit, search)
  },
  queryOverpass ({commit}, viewPort) {
    queryBoxFn(commit, viewPort)
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
  },
  setViewPort (state, data) {
    state.viewPort = {
      boundingBox: convertToBoundingBox(data.topRight, data.bottomLeft),
      zoom: data.zoom
    }
  },
  setBusinesses (state, businesses) {
    state.businesses = businesses
  },
  setMode (state, mode) {
    state.mode = mode
  }
}

const getters = {
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
  },
  viewPort (state) {
    return state.viewPort
  },
  businesses (state) {
    return state.businesses
  },
  mode (state) {
    return state.mode
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
