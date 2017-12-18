/* eslint-disable no-param-reassign */
import * as _ from 'lodash';
import { query } from './../api/nominatimApi';
import { queryBox } from '../api/overpassApi';

const state = {
  mapPosition: null,
  position: null,

  search: null,
  suggestions: [],
  viewPort: null,

  businesses: [],
  mode: 'tiles',
  showHelp: true,
  showLoginHelp: true,
};

const queryDebounceMs = 400;
const queryMinLength = 3;
const requestThrottleMs = 1000;

const minZoomBusinesses = 18;

function q(commit, search) {
  if (!_.isString(search) || search.length < queryMinLength) {
    commit('setSuggestions', []);
  } else {
    query(search).then((results) => {
      commit('setSuggestions', results);
    });
  }
}

function qb(commit, viewPort) {
  if (viewPort.zoom < minZoomBusinesses) {
    commit('setBusinesses', []);
  } else {
    queryBox(viewPort.boundingBox).then((res) => {
      commit('setBusinesses', res);
    });
  }
}

function convertToBoundingBox(topRight, bottomLeft) {
  return {
    south: bottomLeft.lat,
    west: bottomLeft.lng,
    north: topRight.lat,
    east: topRight.lng,
  };
}

const queryFn = _.debounce(_.throttle(q, requestThrottleMs), queryDebounceMs);

const queryBoxFn = _.debounce(qb, queryDebounceMs);

const actions = {
  queryNominatim({ commit }, search) {
    queryFn(commit, search);
  },
  queryOverpass({ commit }, viewPort) {
    queryBoxFn(commit, viewPort);
  },
};

const mutations = {
  setPosition(s, pos) {
    s.position = pos;
  },
  setMapPosition(s, pos) {
    s.mapPosition = pos;
    s.position = pos;
  },
  setSearch(s, search) {
    s.search = search;
  },
  setSuggestions(s, suggestions) {
    s.suggestions = suggestions;
  },
  selectPoint(s, point) {
    s.suggestions = [];
    s.search = point.name;
  },
  resetSearch(s) {
    s.search = '';
    s.suggestions = [];
  },
  setViewPort(s, data) {
    s.viewPort = {
      boundingBox: convertToBoundingBox(data.topRight, data.bottomLeft),
      zoom: data.zoom,
    };
  },
  setBusinesses(s, businesses) {
    s.businesses = businesses;
  },
  setMode(s, mode) {
    s.mode = mode;
  },
  setShowHelp(s, showHelp) {
    s.showHelp = showHelp;
  },
  setShowLoginHelp(s, showLoginHelp) {
    s.showLoginHelp = showLoginHelp;
  },
};

const getters = {
  searchText(s) {
    return s.search;
  },
  suggestions(s) {
    return s.suggestions;
  },
  position(s) {
    return s.position;
  },
  mapPosition(s) {
    return s.mapPosition;
  },
  viewPort(s) {
    return s.viewPort;
  },
  businesses(s) {
    return s.businesses;
  },
  mode(s) {
    return s.mode;
  },
  showHelp(s) {
    return s.showHelp;
  },
  showLoginHelp(s) {
    return s.showLoginHelp;
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
