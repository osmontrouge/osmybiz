import nominatimApi from './../api/nominatimApi'

const state = {
  address: {},
  query: ''
}

const actions = {
  loadFromNominatim ({commit}) {
    nominatimApi.loadAddress(state.query).then(ps => {
      commit('setAddress', ps.data[0])
    })
  }
}

const mutations = {
  setAddress (state, address) {
    state.address = address
  },
  setQuery (state, query) {
    state.query = query
  }
}

const getters = {
  address (state) {
    return state.address
  },
  query (state) {
    return state.query
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
