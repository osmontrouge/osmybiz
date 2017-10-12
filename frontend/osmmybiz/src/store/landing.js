import {latLng} from 'leaflet'

const state = {
  initialPos: latLng(47.223490, 8.817737),  // Hsr
  initialZoom: 13,
  tileUrl: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
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
  }
}

export default {
  state,
  getters
}
