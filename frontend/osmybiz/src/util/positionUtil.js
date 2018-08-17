import * as _ from 'lodash';
import { latLng } from 'leaflet';
import { initialPosition, initialZoom, LatLngRoundingAccuracy } from '../config/config';
import { routes } from '../router';

function fallBackPosition() {
  return {
    cords: initialPosition,
    zoom: initialZoom,
  };
}

const positionKey = 'MAP_POSITION_KEY';
const zoomOnSpecifigLocation = 18;

function getStoredPosition() {
  const stored = JSON.parse(localStorage.getItem(positionKey));

  if (stored && stored.cords && _.isNumber(stored.zoom) &&
    _.isNumber(stored.cords.lat) && _.isNumber(stored.cords.lng)) {
    return stored;
  }
  return null;
}

function storePosition(cords, zoom) {
  const pos = {
    cords,
    zoom,
  };
  localStorage.setItem(positionKey, JSON.stringify(pos));
}

export function storeViewPort(bbox, zoom, $router) {
// eslint-disable-next-line no-underscore-dangle
  const lat = ((bbox._northEast.lat + bbox._southWest.lat) / 2)
    .toFixed(LatLngRoundingAccuracy);
  // eslint-disable-next-line no-underscore-dangle
  const lng = ((bbox._northEast.lng + bbox._southWest.lng) / 2)
    .toFixed(LatLngRoundingAccuracy);

  storePosition(latLng(lat, lng), zoom);

  $router.push({ name: routes.Landing, params: { zoom, lat, lng } });
}

function extractHash(params) {
  const zoom = parseInt(params.zoom, 10) || zoomOnSpecifigLocation;
  const lat = parseFloat(params.lat);
  const lng = parseFloat(params.lng);

  if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
    return {
      cords: latLng(lat, lng),
      zoom,
    };
  }
  return null;
}

function getBrowserLocation() {
  return new Promise((resolve) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((location) => {
        const pos = {
          cords: latLng(location.coords.latitude, location.coords.longitude),
          zoom: zoomOnSpecifigLocation,
        };
        resolve(pos);
      }, () => {
        resolve(null);
      }, {
        timeout: 5000,
      });
    } else {
      resolve(null);
    }
  });
}

export function getInitialPosition(params) {
  return new Promise((resolve) => {
    const fromUrl = extractHash(params);

    if (_.isObject(fromUrl)) {
      resolve(fromUrl);
      return;
    }

    const stored = getStoredPosition();

    if (_.isObject(stored)) {
      resolve(stored);
      return;
    }

    getBrowserLocation().then((pos) => {
      if (_.isObject(pos)) {
        resolve(pos);
      } else {
        resolve(fallBackPosition());
      }
    });
  });
}
