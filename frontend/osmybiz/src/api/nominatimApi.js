import axios from 'axios';
import { latLng } from 'leaflet';
import * as _ from 'lodash';
import { nominatimReverseUrl, nominatimUrl } from '../config/config';
import { setError } from '../store/error';

const queryMax = 10;

function parseCoords(lat, lng) {
  const latNr = parseFloat(lat);
  const lngNr = parseFloat(lng);

  if (Number.isNaN(latNr) || Number.isNaN(lngNr)) {
    return null;
  }

  return latLng(latNr, lngNr);
}

function parseAddress(data) {
  const street = data.pedestrian || data.road || data.suburb || data.footway || '';
  const place = data.place || '';
  const housenumber = data.house_number || '';
  const postcode = data.postcode || '';
  const city = data.city || data.village || data.town || data.hamlet || '';
  const country = data.country || '';

  return {
    street,
    housenumber,
    place,
    postcode,
    city,
    country,
  };
}

function mapResults(results) {
  const points = results.map(point => ({
    coords: parseCoords(point.lat, point.lon),
    osmId: point.osm_id,
    address: parseAddress(point.address),
  })).filter(p => _.isObject(p.coords) && p.address.city !== undefined);
  if (points.length === 5) {
    return points;
  }
  return points.splice(0, 5);
}

function buildRequest(q, count, language) {
  const c = count > queryMax ? queryMax : count;
  return `${nominatimUrl}?format=json&q=${q}&limit=${c}&addressdetails=1&accept-language=${language}`;
}

export function query(queryString, language) {
  return axios.get(buildRequest(queryString, 7, language))
    .then(response => mapResults(response.data))
    .catch(() => {
      setError(['error.nominatim']);
    });
}

function buildReverseRequest(position) {
  return `${nominatimReverseUrl}?format=json&lat=${position.lat}&lon=${position.lng}&addressdetails=1&zoom=18`;
}

export function reverseQuery(position) {
  return axios.get(buildReverseRequest(position))
    .then(response => parseAddress(response.data.address))
    .catch((e) => {
      setError(['error.nominatim']);
      console.error(e);
    });
}
