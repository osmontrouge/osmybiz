/* eslint-disable no-param-reassign */
import { getNotes } from './../api/osmApi';
import { surroundingQueryNode } from '../api/overpassApi';
import detail from '../store/detail';

const state = {
  isDuplicate: false,
  isConfirm: false,
  noteLink: '',
  action() {},
};

const actions = {
  checkDuplicateNode({ commit }) {
    return new Promise((resolve) => {
      if (detail.state.details.category.value === 0) {
        resolve(false);
        commit('setIsDuplicate', false);
      } else {
        surroundingQueryNode(detail.state.details, detail.state.lat, detail.state.lon)
          .then((ps) => {
            resolve(ps);
            commit('setIsDuplicate', ps);
          });
      }
    });
  },
  checkDuplicateNote({ commit }, data) {
    return new Promise((resolve) => {
      getNotes(data.lat, data.lng).then((ps) => {
        let duplicate = false;
        let noteLink = '';
        ps.forEach((note) => {
          if (note.properties.status === 'open') {
            const text = note.properties.comments[0].text;
            const fields = text.split('\n');
            if (fields[0] === '#OSMyBiz ') {
              const cat = fields[3].split(':')[1].substring(1);
              if (fields[3] === `Category: ${cat}:${data.tags[cat]}` &&
                fields[4] === `Name: ${data.tags.name}`) {
                duplicate = true;
                noteLink = `https://master.apis.dev.openstreetmap.org/note/${note.properties.id}/#map=19/${note.geometry.coordinates[1]}/${note.geometry.coordinates[0]}&layers=ND`;
              }
            }
          }
        });
        resolve(duplicate);
        commit('setNoteLink', noteLink);
        commit('setIsDuplicate', duplicate);
      });
    });
  },
  getConfirmation({ commit }, action) {
    commit('setIsConfirm', true);
    commit('setAction', action);
  },
};

const mutations = {
  setIsDuplicate(s, isDuplicate) {
    s.isDuplicate = isDuplicate;
  },
  setIsConfirm(s, isConfirm) {
    s.isConfirm = isConfirm;
  },
  setNoteLink(s, noteLink) {
    s.noteLink = noteLink;
  },
  setAction(s, action) {
    s.action = action;
  },
};

const getters = {
  isDuplicate(s) {
    return s.isDuplicate;
  },
  isConfirm(s) {
    return s.isConfirm;
  },
  noteLink(s) {
    return s.noteLink;
  },
  action(s) {
    return s.action;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
