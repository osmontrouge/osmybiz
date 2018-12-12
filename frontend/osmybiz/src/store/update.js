/* eslint-disable no-param-reassign */
import * as _ from 'lodash';
import { addOrUpdateUser, fetchBusinessPOIs, unsubscribe } from './../api/osmybizApi';
import { getBusinessPOI, getNotesByOsmId } from './../api/osmApi';
import util from '../util/osmApiUtils';

const state = {
  businessPOIs: [],
  showWatchList: false,
};

function hasVersionUpdate(ownedBusinessPOI, osmBusinessPOI) {
  return (osmBusinessPOI.version > ownedBusinessPOI.version);
}

function isNoteWithoutOsmElement(osmId) {
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
          const promise = new Promise((resolve) => {
            if (ownedBusinessPOI.noteId) {
              // update note status
              getNotesByOsmId(ownedBusinessPOI.noteId).then((response) => {
                const noteStatus = util.parseNoteStatus(response);
                if (noteStatus === 'closed') {
                  ownedBusinessPOI.noteIsResolved = true;
                }
                resolve(ownedBusinessPOI);
              });
            } else {
              resolve(ownedBusinessPOI);
            }
          });

          promise.then(() => {
            if (isNoteWithoutOsmElement(ownedBusinessPOI.id)) {
              ownedBusinessPOI.tags = {};
              ownedBusinessPOI.tags.name = n.name;
              commit('pushBusinessPOI', ownedBusinessPOI);
            } else {
              getBusinessPOI(n.osmType, n.osmId).then((osmBusinessPOI) => {
                if (_.isObject(osmBusinessPOI)) {
                  ownedBusinessPOI.tags = osmBusinessPOI.tags;
                  if (hasVersionUpdate(ownedBusinessPOI, osmBusinessPOI)) {
                    ownedBusinessPOI.hasUpdate = true;
                  }
                  commit('pushBusinessPOI', ownedBusinessPOI);
                } else {
                  // TODO handle the case when osm element has been deleted
                }
              });
            }
          });
        });
      });
    });
  },
  /* eslint-disable-next-line */
  removeFromWatchList({ commit }, { ownedBusinessPOI, user }) {
    unsubscribe(user.id, ownedBusinessPOI.id).then(() => {
      this.dispatch('loadUpdates', user);
    });
  },
};

const mutations = {
  setBusinessPOIs(s, businessPOIs) {
    s.businessPOIs = businessPOIs;
  },
  toggleWatchList(s) {
    s.showWatchList = !s.showWatchList;
  },
  pushBusinessPOI(s, businessPOI) {
    s.businessPOIs.push(businessPOI);
  },
};

const getters = {
  showWatchList(s) {
    return s.showWatchList;
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
