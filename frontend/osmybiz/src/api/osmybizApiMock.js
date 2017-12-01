import * as _ from 'lodash'

const userKey = 'MOCK_API_USERS'
const noteKey = 'MOCK_API_NOTES'

function saveUsers (users) {
  localStorage.setItem(userKey, JSON.stringify(users))
}

function saveNodes (notes) {
  localStorage.setItem(noteKey, JSON.stringify(notes))
}

function loadUsers () {
  return JSON.parse(localStorage.getItem(userKey)) || []
}

function loadNodes () {
  return JSON.parse(localStorage.getItem(noteKey)) || []
}

export function mockAddOrUpdateUser (userId, displayName) {
  const users = loadUsers()
  const existing = users.filter(u => u.osmId === userId)[0]

  if (_.isObject(existing)) {
    existing.username = displayName
  } else {
    users.push({osmId: userId, username: displayName})
  }
  saveUsers(users)
  return Promise.resolve()
}

export function mockFetchnodes (userId) {
  const users = loadUsers()
  const user = users.filter(u => u.osmId === userId)[0]

  if (_.isObject(user)) {
    return Promise.reject('User not found')
  }

  const nodes = loadNodes().filter(n => n.userId === userId)
  return Promise.resolve(nodes)
}

export function mockAddOrUpdateNode (userId, node) {
  const users = loadUsers()
  const user = users.filter(u => u.osmId === userId)[0]

  if (_.isObject(user)) {
    return Promise.reject('User not found')
  }
  const nodes = loadNodes()
  let existingNode = nodes.filter(n => n.osmId === node.osmId && n.userId === userId)[0]
  if (!_.isObject(existingNode)) {
    existingNode = {osmId: node.osmId, userId: userId}
    nodes.push(existingNode)
  }
  existingNode.lat = node.lat
  existingNode.lng = node.lng
  existingNode.version = node.version
  existingNode.recieveUpdates = node.recieveUpdates

  saveNodes(nodes)
  return Promise.resolve()
}

export function mockUnsubscribe (userId, nodeId) {
  const users = loadUsers()
  const user = users.filter(u => u.osmId === userId)[0]

  if (_.isObject(user)) {
    return Promise.reject('User not found')
  }
  const nodes = loadNodes()
  let node = nodes.filter(n => n.osmId === nodeId && n.userId === userId)[0]
  if (!_.isObject(node)) {
    return Promise.reject('Node not found')
  }

  node.recieveUpdates = false
  saveNodes(nodes)
  return Promise.resolve()
}
