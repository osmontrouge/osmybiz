import {getNotes} from './../api/osmApi'
import {surroundingQueryNode} from '../api/overpassApi'
import detail from '../store/detail'

const state = {
  isDuplicate: false,
  isConfirm: false,
  noteLink: '',
  action: function () {}
}

const actions = {
  checkDuplicateNode ({commit}) {
    return new Promise((resolve) => {
      surroundingQueryNode(detail.state.details, detail.state.lat, detail.state.lon).then(ps => {
        resolve(ps)
        commit('setIsDuplicate', ps)
      })
    })
  },
  checkDuplicateNote ({commit}, data) {
    return new Promise((resolve) => {
      getNotes(data.lat, data.lng).then(ps => {
        let duplicate = false
        let noteLink = ''
        ps.forEach(function (note) {
          if (note.properties.status === 'open') {
            const text = note.properties.comments[0].text
            const fields = text.split('\n')
            const cat = fields[3].split(':')[1].substring(1)
            if (fields[0] === '#OSMyBiz ' &&
              fields[3] === 'Category: ' + cat + ':' + data.tags[cat] &&
              fields[4] === 'Name: ' + data.tags['name']) {
              duplicate = true
              noteLink = 'https://master.apis.dev.openstreetmap.org/note/' + note.properties.id + '/#map=19/' + note.geometry.coordinates[1] + '/' + note.geometry.coordinates[0] + '&layers=ND'
            }
          }
        })
        resolve(duplicate)
        commit('setNoteLink', noteLink)
        commit('setIsDuplicate', duplicate)
      })
    })
  },
  getConfirmation ({commit}, action) {
    commit('setIsConfirm', true)
    commit('setAction', action)
  }
}

const mutations = {
  setIsDuplicate (state, isDuplicate) {
    state.isDuplicate = isDuplicate
  },
  setIsConfirm (state, isConfirm) {
    state.isConfirm = isConfirm
  },
  setNoteLink (state, noteLink) {
    state.noteLink = noteLink
  },
  setAction (state, action) {
    state.action = action
  }
}

const getters = {
  isDuplicate (state) {
    return state.isDuplicate
  },
  isConfirm (state) {
    return state.isConfirm
  },
  noteLink (state) {
    return state.noteLink
  },
  action (state) {
    return state.action
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
