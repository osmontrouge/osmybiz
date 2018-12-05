/* eslint-disable no-param-reassign */
import * as _ from 'lodash';
import { addOrUpdateUser, fetchBusinessPOIs, deleteBusinessPOI, unsubscribe } from './../api/osmybizApi';
import { getBusinessPOI } from './../api/osmApi';
import util from './../util/updateUtil';

const state = {
  updates: [],
  businessPOIs: [],
  showBookmarks: false,
};

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
          };
          if (isTemporaryOsmId(n.osmId)) {
            ownedBusinessPOI.tags = {};
            ownedBusinessPOI.tags.name = n.name;
            commit('pushBusinessPOI', ownedBusinessPOI);
          } else {
            getBusinessPOI(n.osmType, n.osmId).then((businessPOI) => {
              const update = util.getUpdate(n, businessPOI);
              if (_.isObject(update)) {
                commit('pushUpdate', update);
              }

              if (_.isObject(businessPOI)) {
                ownedBusinessPOI.tags = businessPOI.tags;
                commit('pushBusinessPOI', ownedBusinessPOI);
              }
            });
          }
        });
      });
    }, () => {
    });
  },

  ignoreFutureUpdates({ commit }, { update, user }) {
    unsubscribe(user.id, update.id).then(() => {
      commit('removeUpdate', update);
    });
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
  toggleBookmarks(s) {
    s.showBookmarks = !s.showBookmarks;
  },
  pushBusinessPOI(s, businessPOI) {
    s.businessPOIs.push(businessPOI);
  },
};

const getters = {
  updates(s) {
    return s.updates;
  },
  showBookmarks(s) {
    return s.showBookmarks;
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
