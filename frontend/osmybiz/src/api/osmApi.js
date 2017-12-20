import osmAuth from 'osm-auth';
import axios from 'axios';
import { osmUrl, osmApiLevel, oauthKey, oauthSecret } from '../config/config';
import { setError } from '../store/error';
import { get } from '../util/translate';
import util from './../util/osmApiUtils';

const createNotePath = `${osmApiLevel}notes.json`;
const createChangesetPath = `${osmApiLevel}changeset/create`;
const uploadChangesetPath = `${osmApiLevel}changeset/`;
const closeChangesetPath = `${osmApiLevel}changeset/`;
const getNodePath = `${osmApiLevel}node/`;
const userPath = `${osmApiLevel}user/details.json`;


const auth = osmAuth({
  oauth_consumer_key: oauthKey,
  oauth_secret: oauthSecret,
  auto: false,
  url: osmUrl,
  landing: location.pathname,
  singlepage: true,
});


export function login() {
  auth.authenticate(() => {
    setError(get().locale.error.osm.login);
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
          setError(get().locale.error.osm.loadUser);
          resolve(null);
        }
        resolve(util.parseUser(response));
      });
    }
  });
}

// temporary fix to redirect to live api, because dev environment is currentliy borken
function getNode2(nodeId) {
  return axios.get(`https://api.openstreetmap.org/api/0.6/node/${nodeId}`).then(res => util.parseNode(res.data));
}

export function getNode(nodeId) {
  return new Promise((resolve, reject) => {
    auth.xhr(
      {
        method: 'GET',
        path: getNodePath + nodeId,
      }, (err, response) => {
      if (err) {
        if (err.status === 410) {
          resolve(null);
        } else if (err.status === 404) {
          getNode2(nodeId).then((res) => {
            resolve(res);
          }).catch(() => {
            resolve(null);
          });
        } else {
          setError(get().locale.error.osm.load);
          reject(err);
        }
      } else {
        resolve(util.parseNode(response));
      }
    });
  });
}


function closeChangeset(changesetId) {
  auth.xhr(
    {
      method: 'PUT',
      path: `${closeChangesetPath + changesetId}/close`,
    }, (err) => {
    if (err) {
      setError(get().locale.error.osm.load);
    }
  });
}

function uploadChangeset(node, changesetId) {
  const upload = util.constructUpload(node, changesetId);
  return new Promise((resolve) => {
    auth.xhr(
      {
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
        setError(get().locale.error.osm.load);
        resolve(null);
      }
      closeChangeset(changesetId);

      resolve(getNode(util.extractId(response)));
    });
  });
}

export function postNode(node) {
  const create =
    '<osm>' +
    '<changeset>' +
    '<tag k="comment" v="#OsMyBiz"/>' +
    '<tag k="created_by" v="OSMyBiz"/>' +
    '<tag k="changesets_count" v="1"/>' +
    '</changeset>' +
    '</osm>';
  return new Promise((resolve) => {
    auth.xhr(
      {
        method: 'PUT',
        path: createChangesetPath,
        content: create,
        options: {
          header: {
            'Content-Type': 'text/xml',
          },
        } }, (err, changesetId) => {
      if (err) {
        setError(get().locale.error.osm.postNode);
      }
      resolve(uploadChangeset(node, changesetId));
    });
  });
}

export function postNote(note) {
  return new Promise((resolve) => {
    auth.xhr(
      {
        method: 'POST',
        path: createNotePath,
        content: `lat=${note.lat}&lon=${note.lon}&text=${note.text}`,
      }, (err, response) => {
      if (err) {
        setError(get().locale.error.osm.postNote);
        resolve(null);
      }
      const data = JSON.parse(response);
      resolve({
        html: data.properties.comments[0].html,
        text: data.properties.comments[0].text,
        id: data.properties.id,
        link: `${osmUrl}/note/${data.properties.id}/#map=19/${data.geometry.coordinates[1]}/${data.geometry.coordinates[0]}&layers=ND`,
        status: data.properties.status,
      });
    });
  });
}

export function getNotes(lat, lng) {
  const left = lng - 0.00005;
  const bottom = lat - 0.00005;
  const right = lng + 0.00005;
  const top = lat + 0.00005;
  return new Promise((resolve) => {
    auth.xhr(
      {
        method: 'GET',
        path: `${createNotePath}?bbox=${left},${bottom},${right},${top}`,
      }, (err, response) => {
      if (err) {
        setError(get().error.osm.load);
        resolve(null);
      }
      const data = JSON.parse(response);
      resolve(data.features);
    });
  });
}
