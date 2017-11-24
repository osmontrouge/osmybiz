import {latlng} from 'leaflet'

const state = {
  updates: [
    {
      coords: latlng(47, 8),
      kind: 'node',
      oldVersion: 10,
      newVersion: 11
    },
    {
      coords: latlng(48, 9),
      kind: 'note',
      oldState: 'created',
      newState: 'closed'
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
