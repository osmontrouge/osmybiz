import {addOrUpdateUser, fetchnodes, addOrUpdateNode, deleteNode, unsubscribe} from './../api/osmybizApi'
import {getNode} from './../api/osmApi'
import {getUpdate} from './../util/updateUtil'
import * as _ from 'lodash'

const state = {
  updates: [],
  nodes: [],
  showUpdates: false
}

const actions = {
  loadUpdates ({commit}, user) {
    addOrUpdateUser(user.id, user.name).then(() => {
      fetchnodes(user.id).then(ns => {
        commit('setNodes', ns)

        ns.filter(n => n.recieveUpdates).forEach(n => {
          getNode(n.osmId).then(node => {
            const update = getUpdate(n, node)
            if (_.isObject(update)) {
              commit('pushUpdate', update)
            }
          })
        })
      })
    }, (err) => {
      console.log(err)
    })
  },

  confirmUpdate ({commit}, {user, update}) {
    let promise
    if (update.kind === 'update') {
      promise = addOrUpdateNode(user.id, {
        osmId: update.id,
        version: update.newVersion,
        lat: update.coords.lat,
        lng: update.coords.lng,
        recieveUpdates: true
      })
    } else {
      promise = deleteNode(user.id, update.id)
    }
    promise.then(() => {
      commit('removeUpdate', update)
    })
  },

  ignoreFutureUpdates ({commit}, {update, user}) {
    console.log(update, user)
    unsubscribe(user.id, update.id).then(() => {
      commit('removeUpdate', update)
    })
  }
}

const mutations = {
  setNodes (state, nodes) {
    state.nodes = nodes
  },
  pushUpdate (state, update) {
    state.updates.push(update)
  },
  removeUpdate (state, update) {
    const i = _.findIndex(state.updates, u => u.id === update.id)

    if (i >= 0) {
      state.updates.splice(i, 1)
    }
  },
  toggleUpdates (state) {
    state.showUpdates = !state.showUpdates
  }
}

const getters = {
  updates (state) {
    return state.updates
  },
  showUpdates (state) {
    return state.showUpdates
  },
  updateCount (state) {
    return state.updates.length
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
