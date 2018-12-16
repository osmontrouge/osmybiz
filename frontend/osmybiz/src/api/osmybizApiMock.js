import * as _ from 'lodash';

const userKey = 'MOCK_API_USERS';
const noteKey = 'MOCK_API_NOTES';

function saveUsers(users) {
  localStorage.setItem(userKey, JSON.stringify(users));
}

function saveBusinessPOIs(notes) {
  localStorage.setItem(noteKey, JSON.stringify(notes));
}

function loadUsers() {
  return JSON.parse(localStorage.getItem(userKey)) || [];
}

function loadBusinessPOIs() {
  return JSON.parse(localStorage.getItem(noteKey)) || [];
}

export function mockAddOrUpdateUser(userId, displayName) {
  const users = loadUsers();
  const existing = users.filter(u => u.osmId === userId)[0];

  if (_.isObject(existing)) {
    existing.username = displayName;
  } else {
    users.push({ osmId: userId, username: displayName });
  }
  saveUsers(users);
  return Promise.resolve();
}

export function mockFetchBusinessPOIs(userId) {
  const users = loadUsers();
  const user = users.filter(u => u.osmId === userId)[0];

  if (!_.isObject(user)) {
    return Promise.reject(new Error('User not found'));
  }

  const businessPOIs = loadBusinessPOIs().filter(n => n.userId === userId);
  return Promise.resolve(businessPOIs);
}

export function mockAddOrUpdateBusinessPOI(userId, businessPOI) {
  const users = loadUsers();
  const user = users.filter(u => u.osmId === userId)[0];

  if (!_.isObject(user)) {
    return Promise.reject(new Error('User not found'));
  }
  const businessPOIs = loadBusinessPOIs();
  let existingBusinesPoi =
    businessPOIs.filter(n => n.osmId === businessPOI.osmId && n.userId === userId)[0];
  if (!_.isObject(existingBusinesPoi)) {
    existingBusinesPoi = { osmId: businessPOI.osmId, userId };
    businessPOIs.push(existingBusinesPoi);
  }
  existingBusinesPoi.lat = businessPOI.lat;
  existingBusinesPoi.lng = businessPOI.lng;
  existingBusinesPoi.version = businessPOI.version;
  existingBusinesPoi.receiveUpdates = businessPOI.receiveUpdates;
  existingBusinesPoi.name = businessPOI.name;

  saveBusinessPOIs(businessPOIs);
  return Promise.resolve();
}

export function mockUnsubscribe(userId, businessPOIId) {
  const users = loadUsers();
  const user = users.filter(u => u.osmId === userId)[0];

  if (!_.isObject(user)) {
    return Promise.reject(new Error('User not found'));
  }
  const businessPOIs = loadBusinessPOIs();
  const businessPOI = businessPOIs.filter(n => n.osmId === businessPOIId && n.userId === userId)[0];
  if (!_.isObject(businessPOI)) {
    return Promise.reject(new Error('User not found'));
  }

  businessPOI.receiveUpdates = false;
  saveBusinessPOIs(businessPOIs);
  return Promise.resolve();
}

export function mockDeleteBusinessPOI(userId, businessPOIId) {
  const users = loadUsers();
  const user = users.filter(u => u.osmId === userId)[0];

  if (!_.isObject(user)) {
    return Promise.reject(new Error('User not found'));
  }
  const businessPOIs = loadBusinessPOIs();
  const businessPOI = businessPOIs.filter(n => n.osmId === businessPOIId && n.userId === userId)[0];
  if (!_.isObject(businessPOI)) {
    return Promise.reject(new Error('User not found'));
  }

  const index = businessPOIs.indexOf(businessPOI);
  businessPOIs.splice(index, 1);
  saveBusinessPOIs(businessPOIs);
  return Promise.resolve();
}
