/* eslint-disable no-param-reassign */
import * as _ from 'lodash';
import { addOrUpdateUser, fetchnodes, addOrUpdateNode, deleteNode, unsubscribe } from './../api/osmybizApi';
import { getNode } from './../api/osmApi';
import util from './../util/updateUtil';

const state = {
  updates: [],
  nodes: [],
  showUpdates: false,
  showBookmarks: false,
};

function isTemporaryOsmId(osmId) {
  return (osmId < 0);
}

const actions = {
  loadUpdates({ commit }, user) {
    addOrUpdateUser(user.id, user.name).then(() => {
      fetchnodes(user.id).then((ns) => {
        commit('setNodes', []);

        ns.filter(n => n.receiveUpdates).forEach((n) => {
          const ownedNode = {
            id: n.osmId,
            lat: n.lat,
            lng: n.lng,
            mine: true,
            noteId: n.noteId,
            type: n.osmType,
          };
          if (isTemporaryOsmId(n.osmId)) {
            ownedNode.tags = {};
            ownedNode.tags.name = n.name;
            commit('pushNode', ownedNode);
          } else {
            getNode(n.osmType, n.osmId).then((node) => {
              const update = util.getUpdate(n, node);
              if (_.isObject(update)) {
                commit('pushUpdate', update);
              }

              if (_.isObject(node)) {
                ownedNode.tags = node.tags;
                commit('pushNode', ownedNode);
              }
            });
          }
        });
      });
    }, () => {
    });
  },

  confirmUpdate({ commit }, { user, update }) {
    let promise;
    if (update.kind === 'update') {
      promise = addOrUpdateNode(user.id, {
        osmId: update.id,
        version: update.newVersion,
        lat: update.coords.lat,
        lng: update.coords.lng,
        receiveUpdates: true,
        name: update.name,
        noteId: update.noteId,
      });
    } else {
      promise = deleteNode(user.id, update.id);
    }
    promise.then(() => {
      commit('removeUpdate', update);
    });
  },

  ignoreFutureUpdates({ commit }, { update, user }) {
    unsubscribe(user.id, update.id).then(() => {
      commit('removeUpdate', update);
    });
  },

  deleteOwnedNode({ commit }, { ownedNode, user }) {
    deleteNode(user.id, ownedNode.id).then(() => {
      commit('removeNode', ownedNode);
    });
  },
};

const mutations = {
  setNodes(s, nodes) {
    s.nodes = nodes;
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
  removeNode(s, node) {
    const i = _.findIndex(s.nodes, u => u.id === node.id);

    if (i >= 0) {
      s.nodes.splice(i, 1);
    }
  },
  toggleUpdates(s) {
    s.showUpdates = !s.showUpdates;
    if (s.showBookmarks && s.showUpdates) {
      s.showBookmarks = false;
    }
  },
  toggleBookmarks(s) {
    s.showBookmarks = !s.showBookmarks;
    if (s.showBookmarks && s.showUpdates) {
      s.showUpdates = false;
    }
  },
  pushNode(s, node) {
    s.nodes.push(node);
  },
};

const getters = {
  updates(s) {
    return s.updates;
  },
  showUpdates(s) {
    return s.showUpdates;
  },
  showBookmarks(s) {
    return s.showBookmarks;
  },
  updateCount(s) {
    return s.updates.length;
  },
  ownedNodes(s) {
    return s.nodes;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
