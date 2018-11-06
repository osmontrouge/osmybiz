/* eslint-disable no-param-reassign */
import * as _ from 'lodash';
import { addOrUpdateUser, fetchnodes, addOrUpdateNode, deleteNode, unsubscribe } from './../api/osmybizApi';
import { getNode } from './../api/osmApi';
import util from './../util/updateUtil';

const state = {
  updates: [],
  nodes: [],
  showUpdates: false,
};

const actions = {
  loadUpdates({ commit }, user) {
    addOrUpdateUser(user.id, user.name).then(() => {
      fetchnodes(user.id).then((ns) => {
        commit('setNodes', []);
        ns.filter(n => n.recieveUpdates).forEach((n) => {
          getNode(n.osmId).then((node) => {
            const update = util.getUpdate(n, node);
            if (_.isObject(update)) {
              commit('pushUpdate', update);
            }

            if (_.isObject(node)) {
              const ownedNode = {
                id: n.osmId,
                lat: n.lat,
                lng: n.lng,
                tags: node.tags,
                mine: true,
                noteId: n.noteId,
              };
              commit('pushNode', ownedNode);
            }
          });
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
        recieveUpdates: true,
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
  toggleUpdates(s) {
    s.showUpdates = !s.showUpdates;
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
