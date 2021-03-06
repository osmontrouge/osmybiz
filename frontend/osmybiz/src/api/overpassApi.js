import axios from 'axios';
import { overpassUrl, searchradius } from '../config/config';
import tags from '../assets/tags/de.json';
import { setError } from '../store/error';

export const categoryTags = ['shop', 'amenity', 'tourism', 'office', 'leisure'];

const tagRegex = categoryTags.join('|');

const query = `[out:json];nwr[~"^${tagRegex}$"~"."]({{bbox}});out center;`;
const surroundingQuery = `[out:json];node(around:${searchradius}, {{lat}}, {{lon}})[{{tag}}={{cat}}]["name"="{{name}}"];out;`;

function buildQuery(bbox) {
  return query.replace('{{bbox}}', `${bbox.south}, ${bbox.west}, ${bbox.north}, ${bbox.east}`);
}

function buildSurroundingQuery(details, lat, lon) {
  return surroundingQuery
    .replace('{{name}}', `${details.name}`)
    .replace('{{lat}}', `${lat}`)
    .replace('{{lon}}', `${lon}`)
    .replace('{{tag}}', `${details.category.value.split('/')[0]}`)
    .replace('{{cat}}', `${details.category.value.split('/')[1]}`);
}

function parseData(data) {
  return data.elements.map((e) => {
    if (e.type !== 'node') {
      e.lat = e.center.lat;
      e.lon = e.center.lon;
    }
    return {
      type: e.type,
      id: e.id,
      lat: e.lat,
      lng: e.lon,
      tags: e.tags,
    };
  });
}

function filterTags(businessPOI) {
  return Object.keys(tags).some((f) => {
    const element = f.split('/');
    const key = element[0];
    const value = element[1];
    if (businessPOI.tags[key]) {
      if (businessPOI.tags[key].indexOf(value) === 0) {
        return true;
      }
    }
    return false;
  });
}

export function queryBox(bbox) {
  return axios.post(overpassUrl, buildQuery(bbox))
    .then(res => parseData(res.data).filter(filterTags), () => {
      setError({ errorMessageKey: 'error.overpass.query' });
      return [];
    });
}

export function surroundingQueryBusinessPOI(details, lat, lon) {
  return axios.post(overpassUrl, buildSurroundingQuery(details, lat, lon))
    .then(res => res.data.elements.length > 0, () => {
      setError({ errorMessageKey: 'error.overpass.surrounding' });
      return false;
    });
}
