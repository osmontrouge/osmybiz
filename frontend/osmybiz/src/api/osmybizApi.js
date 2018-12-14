import axios from 'axios';
import { fakeOsmybizApi, osmyBizBackendUrl } from './../config/config';
import {
  mockAddOrUpdateUser,
  mockAddOrUpdateBusinessPOI,
  mockFetchBusinessPOIs,
  mockUnsubscribe,
} from './osmybizApiMock';
import { setError } from '../store/error';

const baseRoute = osmyBizBackendUrl;

if (fakeOsmybizApi) {
// eslint-disable-next-line no-console
  console.warn('Using fake osmybiz bakend');
}

export function addOrUpdateUser(userId, displayName) {
  if (fakeOsmybizApi) {
    return mockAddOrUpdateUser(userId, displayName);
  }
  const route = `${baseRoute}user`;
  return axios.post(route, { osmId: userId, username: displayName })
    .catch((err) => {
      setError(['error.osmybiz', err]);
    });
}

export function fetchBusinessPOIs(userId) {
  if (fakeOsmybizApi) {
    return mockFetchBusinessPOIs(userId);
  }
  const route = `${baseRoute}usera/${userId}/business-poi`;
  return axios.get(route).then(response => response.data)
    .catch((err) => {
      setError(['error.osmybiz', err]);
    });
}

export function addOrUpdateBusinessPOI(userId, businessPOI) {
  if (fakeOsmybizApi) {
    return mockAddOrUpdateBusinessPOI(userId, businessPOI);
  }
  const route = `${baseRoute}user/${userId}/business-poi`;
  return axios.post(route, businessPOI)
    .catch((err) => {
      setError(['error.osmybiz', err]);
    });
}

export function getTemporaryOsmId(userId) {
  // NOT IMPLEMENTED for fakeOsmmybiz
  // if (fakeOsmybizApi) {
  //    return mockAddOrUpdateNote(userId);
  // }
  const route = `${baseRoute}user/${userId}/temporary-osm-id`;
  return axios.get(route)
    .then(response => response.data)
    .catch((err) => {
      setError(['error.osmybiz', err]);
    });
}

export function unsubscribe(userId, osmId) {
  if (fakeOsmybizApi) {
    return mockUnsubscribe(userId, osmId);
  }
  const route = `${baseRoute}user/${userId}/business-poi/${osmId}/unsubscribe`;
  return axios.post(route)
    .catch((err) => {
      setError(['error.osmybiz', err]);
    });
}

