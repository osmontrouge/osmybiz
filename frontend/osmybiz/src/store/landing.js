import {latLng} from 'leaflet'
import {query} from './../api/nominatimApi'
import * as _ from 'lodash'
import {queryBox} from '../api/overpassApi'

const state = {
  initialPos: latLng(47.223490, 8.817737),  // Hsr
  initialZoom: 15,
  tileUrl: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',

  mapPosition: null,
  position: null,

  search: null,
  suggestions: [],
  viewPort: null
}

const queryDebounceMs = 400
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

function qb (commit, bbox) {
  queryBox(bbox).then(res => {
    console.log(res)
  })
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
  queryOverpass ({commit}, bbox) {
    queryBoxFn(commit, bbox)
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
  },
  viewPort (state) {
    return state.viewPort
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
