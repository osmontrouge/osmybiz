import {addOrUpdateUser, fetchnodes} from './../api/osmybizApi'
import {getNode} from './../api/osmApi'

const state = {
  updates: [],
  nodes: []
}

const actions = {
  loadUpdates ({commit}, user) {
    addOrUpdateUser(user.id, user.name).then(() => {
      fetchnodes(user.id).then(ns => {
        commit('setNodes', ns)

        ns.forEach(n => {
          getNode(n.osmId).then(node => {
            console.log(node)
          })
        })
      })
    }, (err) => {
      console.log(err)
    })
  }
}

const mutations = {
  setNodes (state, nodes) {
    state.nodes = nodes
  }
}

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
