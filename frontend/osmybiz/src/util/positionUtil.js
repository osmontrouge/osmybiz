import * as _ from 'lodash';
import { latLng } from 'leaflet';
import { initialPosition, initialZoom } from '../config/config';

export const FALLBACKPOSITION = { coords: initialPosition, zoom: initialZoom };
const position = 'last_known_position';

function getStoredPosition() {
  const stored = JSON.parse(localStorage.getItem(position));
  if (_.isObject(stored)) {
    return stored;
  }
  return null;
}

export function storePosition(coords, zoom) {
  const pos = {
    coords,
    zoom,
  };
  localStorage.setItem(position, JSON.stringify(pos));
}

function isNumberLatLngZoom(latLngZoom) {
  let { lat, lng, zoom } = latLngZoom;
  [lat, lng, zoom] = [Number(lat), Number(lng), Number(zoom)];
  return !Number.isNaN(lat) && !Number.isNaN(lng) && !Number.isNaN(zoom);
}

function isValidPositionParams(params) {
  if (!params) {
    return false;
  }
  const { coords, zoom } = params;
  const { lat, lng } = coords;
  return isNumberLatLngZoom({ lat, lng, zoom });
}

function latLngZoomToCoordsZoom(latLngZoom) {
  if (isNumberLatLngZoom(latLngZoom)) {
    const coords = latLng(latLngZoom.lat, latLngZoom.lng);
    const { zoom } = latLngZoom;
    return { coords, zoom };
  }
  return null;
}

function getCoordsZoomFromUrl(context) {
  const latLngZoom = context.getUrlParams;
  const coordsZoom = latLngZoomToCoordsZoom(latLngZoom);
  if (isValidPositionParams(coordsZoom)) {
    return coordsZoom;
  }
  return null;
}


export function getPositionFromUrl(context) {
  const posFromUrl = getCoordsZoomFromUrl(context);
  if (isValidPositionParams(posFromUrl)) {
    return posFromUrl;
  }
  const posFromLocalStorage = getStoredPosition();
  if (isValidPositionParams(posFromLocalStorage)) {
    return posFromLocalStorage;
  }
  return FALLBACKPOSITION;
}

export function setPosition(context) {
  const pos = getPositionFromUrl(context);
  context.map.setView(pos.coords, pos.zoom);
}

