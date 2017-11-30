const state = {
  error: '',
  isError: false
}

const actions = {}

const mutations = {
  setError (state, error) {
    state.error = error
  },
  setIsError (state, isError) {
    state.isError = isError
  }
}

const getters = {
  error (state) {
    return state.error
  },
  isError (state) {
    return state.isError
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}

export function setError (error) {
  state.isError = true
  state.error = error
  setTimeout(function () {
    state.isError = false
  }, 5000)
}
