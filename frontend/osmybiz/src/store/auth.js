import authApi from './../api/authApi'

const state = {
  user: {}
}

const actions = {
  authenticate () {
    authApi.authenticate((res) => {
      console.log(res)
    })
  }
}

const mutations = {
}

const getters = {
  user (state) {
    return state.user
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
