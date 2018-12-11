/* eslint-disable no-param-reassign */
import * as _ from 'lodash';
import { addOrUpdateUser, fetchBusinessPOIs, deleteBusinessPOI, unsubscribe } from './../api/osmybizApi';
import { getBusinessPOI, getNotesByOsmId } from './../api/osmApi';
import util from '../util/osmApiUtils';

const state = {
  updates: [],
  businessPOIs: [],
  showWatchList: false,
};

function hasVersionUpdate(ownedBusinessPOI, osmBusinessPOI) {
  return (osmBusinessPOI.version > ownedBusinessPOI.version);
}

function isTemporaryOsmId(osmId) {
  return (osmId < 0);
}

const actions = {
  loadUpdates({ commit }, user) {
    addOrUpdateUser(user.id, user.name).then(() => {
      fetchBusinessPOIs(user.id).then((ns) => {
        commit('setBusinessPOIs', []);

        ns.filter(n => n.receiveUpdates).forEach((n) => {
          const ownedBusinessPOI = {
            id: n.osmId,
            lat: n.lat,
            lng: n.lng,
            mine: true,
            noteId: n.noteId,
            type: n.osmType,
            version: n.version,
            hasUpdate: false,
            noteIsResolved: false,
          };
          if (ownedBusinessPOI.noteId) {
            // update note status
            getNotesByOsmId(ownedBusinessPOI.noteId).then((response) => {
              const noteStatus = util.parseNoteStatus(response);
              if (noteStatus === 'closed') {
                ownedBusinessPOI.noteIsResolved = true;
              }
            });
          }
          if (isTemporaryOsmId(ownedBusinessPOI.id)) {
            ownedBusinessPOI.tags = {};
            ownedBusinessPOI.tags.name = n.name;
            commit('pushBusinessPOI', ownedBusinessPOI);
          } else {
            getBusinessPOI(n.osmType, n.osmId).then((osmBusinessPOI) => {
              if (_.isObject(osmBusinessPOI)) {
                if (hasVersionUpdate(ownedBusinessPOI, osmBusinessPOI)) {
                  ownedBusinessPOI.hasUpdate = true;
                }
                ownedBusinessPOI.tags = osmBusinessPOI.tags;
                commit('pushBusinessPOI', ownedBusinessPOI);
              } else {
                // TODO when the element has been deleted
              }
            });
          }
        });
      });
    }, () => {
    });
  },
  removeFromWatchList({ commit }, { ownedBusinessPOI, user }) {
    unsubscribe(user.id, ownedBusinessPOI.id).then(() => {
      commit('removeUpdate', ownedBusinessPOI);
    });
    this.dispatch('loadUpdates', user);
  },

  deleteOwnedBusinessPOI({ commit }, { ownedBusinessPOI, user }) {
    deleteBusinessPOI(user.id, ownedBusinessPOI.id).then(() => {
      commit('removeBusinessPOI', ownedBusinessPOI);
    });
  },
};

const mutations = {
  setBusinessPOIs(s, businessPOIs) {
    s.businessPOIs = businessPOIs;
  },
  pushUpdate(s, update) {
    s.updates.push(update);
  },
  removeUpdate(s, update) {
    const i = _.findIndex(s.updates, u => u.id === update.id);

    if (i >= 0) {
      s.updates.splice(i, 1);
    }
  },
  removeBusinessPOI(s, businessPOI) {
    const i = _.findIndex(s.businessPOIs, u => u.id === businessPOI.id);

    if (i >= 0) {
      s.businessPOIs.splice(i, 1);
    }
  },
  toggleWatchList(s) {
    s.showWatchList = !s.showWatchList;
    if (s.showWatchList && s.showUpdates) {
      s.showUpdates = false;
    }
  },
  pushBusinessPOI(s, businessPOI) {
    s.businessPOIs.push(businessPOI);
  },
};

const getters = {
  updates(s) {
    return s.updates;
  },
  showWatchList(s) {
    return s.showWatchList;
  },
  updateCount(s) {
    return s.updates.length;
  },
  ownedBusinessPOIs(s) {
    return s.businessPOIs;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
