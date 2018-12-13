import osmAuth from 'osm-auth';
import axios from 'axios';
import { osmUrl, osmApiLevel, oauthKey, oauthSecret, searchradius } from '../config/config';
import { setError } from '../store/error';
import util from './../util/osmApiUtils';

const createNotePath = `${osmApiLevel}notes.json`;
const notePath = `${osmApiLevel}notes/`;
const createChangesetPath = `${osmApiLevel}changeset/create`;
const uploadChangesetPath = `${osmApiLevel}changeset/`;
const closeChangesetPath = `${osmApiLevel}changeset/`;
const userPath = `${osmApiLevel}user/details.json`;
const apiPath = `${osmApiLevel}`;


const auth = osmAuth({
  oauth_consumer_key: oauthKey,
  oauth_secret: oauthSecret,
  auto: false,
  url: osmUrl,
  landing: window.location.pathname,
  singlepage: true,
});


export function login() {
  auth.authenticate((e) => {
    console.log(e);
    setError(['error.osm.login']);
  });
}

export function isLoggedIn() {
  return auth.authenticated();
}

export function setOauthToken(token) {
  return new Promise((resolve) => {
    auth.bootstrapToken(token, () => {
      resolve(true);
    });
  });
}

export function logout() {
  auth.logout();
}

export function loadUser() {
  return new Promise((resolve) => {
    if (!isLoggedIn()) {
      resolve(null);
    } else {
      auth.xhr({ method: 'GET', path: userPath }, (err, response) => {
        if (err) {
          setError(['error.osm.loadUser']);
          resolve(null);
          return;
        }
        resolve(util.parseUser(response));
      });
    }
  });
}

// temporary fix to redirect to live api, because dev environment is currently broken
function getBusinessPOI2(osmType, osmId) {
  return axios.get(`https://www.openstreetmap.org/api/0.6/${osmType}/${osmId}`).then(res => util.parseBusinessPOI(res.data, osmType));
}

export function getBusinessPOI(osmType, osmId) {
  return new Promise((resolve, reject) => {
    auth.xhr({
      method: 'GET',
      path: `${apiPath}${osmType}/${osmId}`,
    }, (err, response) => {
      if (err) {
        if (err.status === 410) {
          resolve(null);
        } else if (err.status === 404) {
          getBusinessPOI2(osmType, osmId).then((res) => {
            resolve(res);
          }).catch(() => {
            resolve(null);
          });
        } else {
          setError(['error.osm.load']);
          reject(err);
        }
      } else {
        resolve(util.parseBusinessPOI(response));
      }
    });
  });
}


function closeChangeset(changesetId) {
  auth.xhr({
    method: 'PUT',
    path: `${closeChangesetPath + changesetId}/close`,
  }, (err) => {
    if (err) {
      setError(['error.osm.load']);
    }
  });
}

function uploadChangeset(node, changesetId) {
  const upload = util.constructUpload(node, changesetId);
  return new Promise((resolve) => {
    auth.xhr({
      method: 'POST',
      path: `${uploadChangesetPath + changesetId}/upload`,
      content: upload,
      options: {
        header: {
          'Content-Type': 'text/xml',
        },
      },
    }, (err, response) => {
      if (err) {
        setError(['error.osm.load']);
        resolve(null);
      } else {
        closeChangeset(changesetId);
        resolve(getBusinessPOI('node', util.extractId(response)));
      }
    });
  });
}

export function postNode(node) {
  const create =
    '<osm>' +
    '<changeset>' +
    '<tag k="comment" v="#OSMyBiz"/>' +
    '<tag k="created_by" v="OSMyBiz"/>' +
    '<tag k="changesets_count" v="1"/>' +
    '</changeset>' +
    '</osm>';
  return new Promise((resolve) => {
    auth.xhr({
      method: 'PUT',
      path: createChangesetPath,
      content: create,
      options: {
        header: {
          'Content-Type': 'text/xml',
        },
      },
    }, (err, changesetId) => {
      if (err) {
        setError(['error.osm.postNode']);
      }
      resolve(uploadChangeset(node, changesetId));
    });
  });
}

export function postNote(note) {
  return new Promise((resolve) => {
    auth.xhr({
      method: 'POST',
      path: createNotePath,
      content: `lat=${note.lat}&lon=${note.lon}&text=${encodeURIComponent(note.text)}`,
    }, (err, response) => {
      if (err) {
        setError(['error.osm.postNote']);
        resolve(null);
      } else {
        const data = JSON.parse(response);
        resolve({
          html: data.properties.comments[0].html,
          text: data.properties.comments[0].text,
          id: data.properties.id,
          link: `${osmUrl}/note/${data.properties.id}/#map=19/${data.geometry.coordinates[1]}/${data.geometry.coordinates[0]}&layers=ND`,
          status: data.properties.status,
        });
      }
    });
  });
}

export function reopenClosedNoteAndAddComment(note, noteId) {
  return new Promise((resolve) => {
    auth.xhr({
      method: 'POST',
      path: `${notePath}${noteId}/reopen.json`,
      content: `text=${encodeURIComponent(note.text)}`,
    }, (err, response) => {
      if (err) {
        setError(['error.osm.reopenClosedNoteAndAddComment']);
        resolve(null);
      } else {
        const data = JSON.parse(response);
        const mostRecentCommentIndex = data.properties.comments.length - 1;
        resolve({
          html: data.properties.comments[mostRecentCommentIndex].html,
          text: data.properties.comments[mostRecentCommentIndex].text,
          id: data.properties.id,
          link: `${osmUrl}/note/${noteId}/#map=19/${data.geometry.coordinates[1]}/${data.geometry.coordinates[0]}&layers=ND`,
          status: data.properties.status,
        });
      }
    });
  });
}

export function postNoteAsComment(note, noteId) {
  return new Promise((resolve) => {
    auth.xhr({
      method: 'POST',
      path: `${notePath}${noteId}/comment.json`,
      content: `text=${encodeURIComponent(note.text)}`,
    }, (err, response) => {
      const noteIsClosed = 409;
      if (err) {
        if (err.status === noteIsClosed) {
          resolve(reopenClosedNoteAndAddComment(note, noteId));
        } else {
          setError(['error.osm.postNoteAsComment']);
          resolve(null);
        }
      } else {
        const data = JSON.parse(response);
        const mostRecentCommentIndex = data.properties.comments.length - 1;
        resolve({
          html: data.properties.comments[mostRecentCommentIndex].html,
          text: data.properties.comments[mostRecentCommentIndex].text,
          id: data.properties.id,
          link: `${osmUrl}/note/${noteId}/#map=19/${data.geometry.coordinates[1]}/${data.geometry.coordinates[0]}&layers=ND`,
          status: data.properties.status,
        });
      }
    });
  });
}

export function getNotes(lat, lng) {
  // 0.0001 lat equates to 11.1 meter
  // to get the accuracy of lng you have to multiply the distance with the cosinus of lat
  const distance = (0.0001 / 11.1) * searchradius;
  const left = lng + (distance * Math.cos(lat));
  const bottom = lat - distance;
  const right = lng - (distance * Math.cos(lat));
  const top = lat + distance;
  return axios.get(`${osmUrl}${createNotePath}?bbox=${left},${bottom},${right},${top}`).then(response => response.data.features)
    .catch(() => {
      setError(['error.osm.load']);
      return [];
    });
}

export function getNotesByOsmId(noteId) {
  return axios.get(`${osmUrl}${osmApiLevel}notes/${noteId}`)
    .catch(() => {
      setError(['error.osm.getNotesByOsmId']);
    });
}

