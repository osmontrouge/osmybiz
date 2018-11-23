import axios from 'axios';
import { fakeOsmybizApi, osmyBizBackendUrl } from './../config/config';
import {
  mockAddOrUpdateUser, mockAddOrUpdateNode, mockFetchnodes, mockUnsubscribe,
  mockDeleteNode,
} from './osmybizApiMock';

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
  return axios.post(route, {
    osmId: userId,
    username: displayName,
  });
}

export function fetchnodes(userId) {
  if (fakeOsmybizApi) {
    return mockFetchnodes(userId);
  }
  const route = `${baseRoute}user/${userId}/business-poi`;
  return axios.get(route).then(response => response.data);
}

export function addOrUpdateNode(userId, node) {
  if (fakeOsmybizApi) {
    return mockAddOrUpdateNode(userId, node);
  }
  const route = `${baseRoute}user/${userId}/business-poi`;
  return axios.post(route, node);
}

export function getTemporaryOsmId(userId) {
  // NOT IMPLEMENTED for fakeOsmmybiz
  // if (fakeOsmybizApi) {
  //    return mockAddOrUpdateNote(userId);
  // }
  const route = `${baseRoute}user/${userId}/temporary-osm-id`;
  return axios.get(route).then(response => response.data);
}

export function unsubscribe(userId, nodeId) {
  if (fakeOsmybizApi) {
    return mockUnsubscribe(userId, nodeId);
  }
  const route = `${baseRoute}user/${userId}/business-poi/${nodeId}/unsubscribe`;
  return axios.post(route);
}

export function deleteNode(userId, nodeId) {
  if (fakeOsmybizApi) {
    return mockDeleteNode(userId, nodeId);
  }
  const route = `${baseRoute}user/${userId}/business-poi/${nodeId}/delete`;
  return axios.post(route);
}
