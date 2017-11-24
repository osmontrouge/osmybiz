import {latLng} from 'leaflet'

const state = {
  updates: [
    {
      coords: latLng(46.96005, 8.01270),
      kind: 'node',
      oldVersion: 10,
      newVersion: 11,
      name: 'Test Poi',
      date: new Date(2017, 10, 23)
    },
    {
      coords: latLng(46.95453, 8.02168),
      kind: 'note',
      oldState: 'created',
      newState: 'closed',
      name: 'Test Notiz',
      date: new Date(2017, 10, 21)
    }
  ]
}

const actions = {}
const mutations = {}
const getters = {
  updates (state) {
    return state.updates
  },
  hasUpdates (state) {
    return state.updates.length > 0
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
