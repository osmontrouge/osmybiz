/* eslint-disable no-param-reassign */
import * as _ from 'lodash';
import { query } from './../api/nominatimApi';
import { queryBox } from '../api/overpassApi';
import { getPositionFromUrl } from '../util/positionUtil';

const state = {
  map: null,
  mapCenter: null,
  mapZoom: null,

  urlParams: null,
  search: null,
  suggestions: [],
  viewPort: null,

  businesses: [],
  mode: 'vector',
  showHelp: true,
  showLoginHelp: true,
  applyOffset: false,
};

const queryDebounceMs = 400;
const queryMinLength = 3;
const requestThrottleMs = 1000;

const minZoomBusinesses = 18;

function q(commit, search, language) {
  if (!_.isString(search) || search.length < queryMinLength) {
    commit('setSuggestions', []);
  } else {
    query(search, language).then((results) => {
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

function convertToBoundingBox(bounds) {
  return {
    south: bounds.getSouth(),
    west: bounds.getWest(),
    north: bounds.getNorth(),
    east: bounds.getEast(),
  };
}

const queryFn = _.debounce(_.throttle(q, requestThrottleMs), queryDebounceMs);

const queryBoxFn = _.debounce(qb, queryDebounceMs);

const actions = {
  queryNominatim({ commit }, search, language) {
    queryFn(commit, search, language);
  },
  queryOverpass({ commit }) {
    queryBoxFn(commit, state.viewPort);
  },
};

const mutations = {
  setUrlParams(s, params) {
    s.urlParams = params;
  },
  setMapCenter(s, pos) {
    s.mapCenter = pos;
  },
  setMapZoom(s, zoom) {
    s.mapZoom = zoom;
  },
  setMapViewToUrl(s) {
    const pos = getPositionFromUrl(s);
    s.map.setView(pos.coords, pos.zoom);
  },
  setMapViewToCoordsZoom(s, { coords, zoom }) {
    s.map.setView(coords, zoom);
  },
  setMap(s, mapObject) {
    s.map = mapObject;
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
      boundingBox: convertToBoundingBox(data.bounds),
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
  setApplyOffset(s, applyOffset) {
    s.applyOffset = applyOffset;
  },
};

const getters = {
  searchText(s) {
    return s.search;
  },
  suggestions(s) {
    return s.suggestions;
  },
  urlParams(s) {
    return s.urlParams;
  },
  map(s) {
    return s.map;
  },
  mapCenter(s) {
    return s.mapCenter;
  },
  mapZoom(s) {
    return s.mapZoom;
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
  applyOffset(s) {
    return s.applyOffset;
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
