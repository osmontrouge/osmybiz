import testApi from './../api/testApi'
import * as _ from 'lodash'

const state = {
  testCollection: [],
  text: ''
}

const actions = {
  load ({commit}) {
    testApi.loadTests().then(ps => {
      commit('set', ps)
    })
  }
}

const mutations = {
  add (state, item) {
    if (!_.find(state.testCollection, i => i.id === item.id)) {
      state.testCollection = [...state.testCollection, item]
    }
  },
  set (state, items) {
    state.testCollection = items
  },

  remove (state, item) {
    state.testCollection = state.testCollection.filter(i => i.id !== item.id)
  },
  setText (state, text) {
    state.text = text
  }
}

const getters = {
  count (state) {
    return state.testCollection.length
  },
  all (state) {
    return state.testCollection
  },
  nextId (state) {
    const oldMax = _(state.testCollection).map(i => i.id).max()
    return oldMax + 1
  },
  text (state) {
    return state.text
  },
  canAdd (state) {
    return state.text.length
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
