/* eslint-disable no-param-reassign */
import * as _ from 'lodash';
import { addOrUpdateUser, fetchBusinessPOIs, unsubscribe } from './../api/osmybizApi';
import { getBusinessPOI, getNotesByOsmId } from './../api/osmApi';
import util from '../util/osmApiUtils';
import { setError } from './error';

const state = {
  subscribedBusinessPOIs: [],
  showWatchList: false,
};

function hasVersionUpdate(subscribedBusinessPOI, osmBusinessPOI) {
  return (osmBusinessPOI.version > subscribedBusinessPOI.version);
}

function isNoteWithoutOsmElement(osmId) {
  return (osmId < 0);
}

const actions = {
  loadUpdates({ commit }, user) {
    addOrUpdateUser(user.id, user.name).then(() => {
      fetchBusinessPOIs(user.id).then((ns) => {
        commit('setSubscribedBusinessPOIs', []);
        ns.filter(n => n.receiveUpdates).forEach((n) => {
          const subscribedBusinessPOI = {
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
          const promise = new Promise((resolve) => {
            if (subscribedBusinessPOI.noteId) {
              // update note status
              getNotesByOsmId(subscribedBusinessPOI.noteId).then((response) => {
                const noteStatus = util.parseNoteStatus(response);
                if (noteStatus === 'closed') {
                  subscribedBusinessPOI.noteIsResolved = true;
                }
                resolve(subscribedBusinessPOI);
              });
            } else {
              resolve(subscribedBusinessPOI);
            }
          });

          promise.then(() => {
            if (isNoteWithoutOsmElement(subscribedBusinessPOI.id)) {
              subscribedBusinessPOI.tags = {};
              subscribedBusinessPOI.tags.name = n.name;
              commit('pushSubscribedBusinessPOI', subscribedBusinessPOI);
            } else {
              getBusinessPOI(n.osmType, n.osmId).then((osmBusinessPOI) => {
                if (_.isObject(osmBusinessPOI)) {
                  subscribedBusinessPOI.tags = osmBusinessPOI.tags;
                  if (hasVersionUpdate(subscribedBusinessPOI, osmBusinessPOI)) {
                    subscribedBusinessPOI.hasUpdate = true;
                  }
                  commit('pushSubscribedBusinessPOI', subscribedBusinessPOI);
                } else {
                  setError({ errorMessageKey: 'error.osm.osmElementDeleted', placeholders: [n.name] });
                  subscribedBusinessPOI.tags = {};
                  subscribedBusinessPOI.tags.name = n.name;
                  commit('pushSubscribedBusinessPOI', subscribedBusinessPOI);
                }
              });
            }
          });
        });
      });
    });
  },
  /* eslint-disable-next-line */
  removeFromWatchList({ commit }, { subscribedBusinessPOI, user }) {
    unsubscribe(user.id, subscribedBusinessPOI.id).then(() => {
      this.dispatch('loadUpdates', user);
    });
  },
};

const mutations = {
  setSubscribedBusinessPOIs(s, subscribedBusinessPOIs) {
    s.subscribedBusinessPOIs = subscribedBusinessPOIs;
  },
  toggleWatchList(s) {
    s.showWatchList = !s.showWatchList;
  },
  pushSubscribedBusinessPOI(s, subscribedBusinessPOI) {
    s.subscribedBusinessPOIs.push(subscribedBusinessPOI);
  },
};

const getters = {
  showWatchList(s) {
    return s.showWatchList;
  },
  subscribedBusinessPOIs(s) {
    return s.subscribedBusinessPOIs;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
