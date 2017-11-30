import axios from 'axios'
const baseRoute = './api/'

export function addOrUpdateUser (userId, displayName) {
  const route = baseRoute + 'user'
  return axios.post(route, {
    osmId: userId,
    username: displayName
  })
}

export function fetchnodes (userId) {
  const route = baseRoute + `user/${userId}/node`
  return axios.get(route)
}

export function addOrUpdateNode (userId, node) {
  const route = baseRoute + `user/${userId}/node`
  return axios.post(route, node)
}

export function unsubscribe (userId, nodeId) {
  const route = baseRoute + `user/${userId}/node/${nodeId}/unsubscribe`
  return axios.post(route)
}
