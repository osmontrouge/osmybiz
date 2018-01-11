import * as L from 'leaflet';
import Vue from 'vue';
import { mapBoxToken } from '../config/config';
import popup from '../components/landing/MapPopup.vue';

const mapbox = `https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.jpg70?access_token=${mapBoxToken}`;
const osm = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';

const Popup = Vue.extend(popup);
const mountPoint = 'popup-mount';

const tileUrls = {
  tiles: osm,
  satellite: mapbox,
};

function getTileUrl(mode) {
  return tileUrls[mode];
}

function makeTileLayer(mode) {
  return L.tileLayer(tileUrls[mode], {
    maxZoom: 19,
    maxNativeZoom: 18,
  });
}


const bizMarker = L.icon({
// eslint-disable-next-line global-require
  iconUrl: require('../assets/biz-marker.png'),
  iconSize: [32, 32],
});

const highlightedMarker = L.icon({
// eslint-disable-next-line global-require
  iconUrl: require('../assets/highlighted-marker.png'),
  iconSize: [32, 32],
});

function buildPopup(map, coords) {
  L.popup({ minWidth: 240, maxWidth: 240, autoPanPadding: new L.Point(100, 280) })
    .setLatLng(coords)
    .setContent(`<div id="${mountPoint}"></div>`)
    .openOn(map);
}

function createPopup(map, coords, parent) {
  buildPopup(map, coords);

  new Popup({
    propsData: {
      text: 'hi',
      parent,
      isNew: true,
      coords,
      business: null,
    },
  }).$mount(`#${mountPoint}`);
}

function editPopup(map, coords, parent, business) {
  buildPopup(map, coords);

  new Popup({
    propsData: {
      text: 'hi',
      parent,
      isNew: false,
      coords,
      business,
    },
  }).$mount(`#${mountPoint}`);
}

function createMarker(business, map, parent, applyOffset) {
  const coords = applyOffset
    ? L.latLng(business.lat, business.lng + 0.000028)
    : L.latLng(business.lat, business.lng);
  const icon = business.mine ? highlightedMarker : bizMarker;
  const m = L.marker(coords, {
    icon,
  });
  m.on('click', () => {
    editPopup(map, coords, parent, business);
  });
  return m;
}

export default {
  createMarker,
  createPopup,
  getTileUrl,
  makeTileLayer,
};
