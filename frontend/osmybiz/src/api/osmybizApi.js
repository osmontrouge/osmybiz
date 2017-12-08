import axios from 'axios'
import {fakeOsmybizApi, osmyBizBackendUrl} from './../config/config'
import {
  mockAddOrUpdateUser, mockAddOrUpdateNode, mockFetchnodes, mockUnsubscribe,
  mockDeleteNode
} from './osmybizApiMock'

const baseRoute = osmyBizBackendUrl + '/api/'

if (fakeOsmybizApi) {
  console.warn('Using fake osmybiz bakend')
}

export function addOrUpdateUser (userId, displayName) {
  if (fakeOsmybizApi) {
    return mockAddOrUpdateUser(userId, displayName)
  }
  const route = baseRoute + 'user'
  return axios.post(route, {
    osmId: userId,
    username: displayName
  })
}

export function fetchnodes (userId) {
  if (fakeOsmybizApi) {
    return mockFetchnodes(userId)
  }
  const route = baseRoute + `user/${userId}/node`
  return axios.get(route).then(response => {
    return response.data
  })
}

export function addOrUpdateNode (userId, node) {
  if (fakeOsmybizApi) {
    return mockAddOrUpdateNode(userId, node)
  }
  const route = baseRoute + `user/${userId}/node`
  return axios.post(route, node)
}

export function unsubscribe (userId, nodeId) {
  if (fakeOsmybizApi) {
    return mockUnsubscribe(userId, nodeId)
  }
  const route = baseRoute + `user/${userId}/node/${nodeId}/unsubscribe`
  return axios.post(route)
}

export function deleteNode (userId, nodeId) {
  if (fakeOsmybizApi) {
    return mockDeleteNode(userId, nodeId)
  }
  const route = baseRoute + `user/${userId}/node/${nodeId}/delete`
  return axios.post(route)
}
