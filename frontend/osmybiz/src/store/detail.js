/* eslint-disable no-param-reassign */
import { latLng } from 'leaflet';
import deepEqual from 'deep-equal';
import { postNode, postNote, getBusinessPOI, postNoteAsComment } from './../api/osmApi';
import { reverseQuery } from './../api/nominatimApi';
import { addOrUpdateBusinessPOI, getTemporaryOsmId } from './../api/osmybizApi';
import {
  osmCreateNodeResponseToSuccessMessageParser,
  osmNoteResponseToSuccessMessageParser,
} from './userdialog';

const initialState = {
  // detailPage
  osmId: null,
  osmType: null,
  isNew: true,
  isFormSubmission: false,
  isEditingUnsavedChanges: false,

  // DetailForm
  address: {},
  lat: null,
  lon: null,
  businessPosition: null,
  details: {
    category: {
      text: '',
      fields: [
        { key: '', name: '', value: '' },
      ],
      value: 0,
    },
    name: '',
    opening_hours: '',
    phone: '',
    email: '',
    website: '',
    wheelchair: '',
    description: '',
    note: '',
  },
  isOwnCategory: false,
  isPopup: false,
  isNote: false,
  infoText: '',

  noteId: null,

  // PostSuccess
  note: {},
};

const state = JSON.parse(JSON.stringify(initialState));
/* eslint-disable */


function constructNote() {
  let text = '#OSMyBiz \n';
  text += '\nmodified tags are denominated with \'*\'\n\n';

  const originalAddress = JSON.parse(localStorage.getItem('address'));
  const originalDetails = JSON.parse(localStorage.getItem('details'));

  Object.keys(state.address).forEach((key) => {
    if (deepEqual(originalAddress[key], state.address[key])) {
      if (state.address[key]) {
        text += (`addr:${key}: ${state.address[key]}\n`);
      }
    } else {
      text += (`* addr:${key}: ${state.address[key]} *\n`);
    }
  });

  Object.keys(state.details).forEach((key) => {
    if (key !== 'category') {
      if (deepEqual(originalDetails[key], state.details[key])) {
        if (state.details[key]) {
          text += (`${key}: ${state.details[key]}\n`);
        }
      } else {
        text += (`*${key}: ${state.details[key]} *\n`);
      }
    }
  });

  if (!state.isOwnCategory) {
    const category = state.details.category.value.split('/');
    if (deepEqual(state.details.category.value, originalDetails.category.value)){
      text += (`${category[0]}: ${category[1]}\n`);
    } else {
      text += (`* ${category[0]}: ${category[1]} *\n`);
    }

    let field;
    for (let i = 0; i < state.details.category.fields.length; i += 1) {
      field = state.details.category.fields[i];
      if (deepEqual(field.value, originalDetails.category.fields[i].value)) {
        if (field.value) {
          text += (`${field.key}: ${field.value}\n`);
        }
      } else {
        text += (`* ${field.key}: ${field.value} *\n`);
      }
    }
  } else {
    text += (`* ${state.details.category.text} *\n`);
  }

  return {
    lat: state.lat,
    lon: state.lon,
    text,
  };
}

export function isNotModified(store) {
  const details = JSON.parse(localStorage.getItem('details'));
  const address = JSON.parse(localStorage.getItem('address'));
  return deepEqual(details, store.details) && deepEqual(address, store.address);
}

export function clearDetails() {
  state.details = {
    category: {
      text: '',
      value: 0,
      fields: [
        { key: '', name: '', value: '' },
      ],
    },
    name: '',
    opening_hours: '',
    phone: '',
    email: '',
    website: '',
    wheelchair: '',
    description: '',
    note: '',
  };
}


export function saveChangesTemporarily() {
  const unsavedChanges = JSON.stringify(state);
  localStorage.setItem('unsavedChanges', unsavedChanges);
}

const actions = {
  postNode({ commit }, user) {
    const businessPOI = {
      lat: state.lat,
      lon: state.lon,
      details: state.details,
      address: state.address,
    };
    return postNode(businessPOI).then((ps) => {
      const createNodeSuccessMessage = osmCreateNodeResponseToSuccessMessageParser(ps);
      commit('setSuccessMessage', createNodeSuccessMessage);
      return addOrUpdateBusinessPOI(user.id, {
        lat: parseFloat(ps.lat),
        lng: parseFloat(ps.lon),
        name: ps.details.name,
        noteId: null,
        osmId: parseInt(ps.id, 10),
        osmType: 'node',
        receiveUpdates: true,
        version: parseInt(ps.version, 10),
      });
    });
  },
  /* eslint-disable-next-line object-curly-newline */
  postNote({ commit }, { user, osmId, noteId, osmType }) {
    const note = constructNote();
    const { name } = state.details;

    if (!noteId) {
      return postNote(note).then((ps) => {
        const noteSuccessMessage = osmNoteResponseToSuccessMessageParser(ps);
        commit('setSuccessMessage', noteSuccessMessage);

        if (osmId) {
          return getBusinessPOI(osmType, osmId).then((businessPOI) => {
            if (businessPOI) {
              if (typeof businessPOI.lat === 'undefined' && typeof businessPOI.lng === 'undefined') {
                // lat & lng is undefined when it is a relation/way,
                // TODO calculate the lat lon instead of using the state
                businessPOI.lat = state.lat;
                businessPOI.lon = state.lon;
              }
              addOrUpdateBusinessPOI(user.id, {
                lat: parseFloat(businessPOI.lat),
                lng: parseFloat(businessPOI.lon),
                name,
                noteId: parseInt(ps.id, 10),
                osmId: parseInt(businessPOI.id, 10),
                osmType,
                receiveUpdates: true,
                version: parseInt(businessPOI.version, 10),
              });
            }
            // TODO handle error status code 410 if the element has been deleted
          });
        }
        return getTemporaryOsmId(user.id).then((temporaryOsmId) => {
          addOrUpdateBusinessPOI(user.id, {
            lat: parseFloat(state.lat),
            lng: parseFloat(state.lon),
            name,
            noteId: parseInt(ps.id, 10),
            osmId: temporaryOsmId,
            osmType,
            receiveUpdates: true,
            version: 0,
          });
        });
      });
    }
    return postNoteAsComment(note, noteId).then((ps) => {
      const noteSuccessMessage = osmNoteResponseToSuccessMessageParser(ps);
      commit('setSuccessMessage', noteSuccessMessage);
      if (state.osmType === 'note') {
        return addOrUpdateBusinessPOI(user.id, {
          lat: parseFloat(state.lat),
          lng: parseFloat(state.lon),
          name,
          noteId: parseInt(ps.id, 10),
          osmId: state.osmId,
          osmType: state.osmType,
          receiveUpdates: true,
          version: 0,
        });
      }
      return getBusinessPOI(osmType, osmId).then((businessPOI) => {
        if (businessPOI) {
          if (typeof businessPOI.lat === 'undefined' && typeof businessPOI.lng === 'undefined') {
            businessPOI.lat = state.lat;
            businessPOI.lon = state.lon;
          }
          addOrUpdateBusinessPOI(user.id, {
            lat: parseFloat(businessPOI.lat),
            lng: parseFloat(businessPOI.lon),
            name,
            noteId: ps.id,
            osmId: parseInt(businessPOI.id, 10),
            osmType,
            receiveUpdates: true,
            version: parseInt(businessPOI.version, 10),
          });
        }
      });
    });
  },
  getAddress({ commit }, position) {
    reverseQuery(position).then((ps) => {
      commit('setAddress', ps);
      localStorage.setItem('address', JSON.stringify(ps));
    });
  },
};

const mutations = {
  setNote(s, note) {
    s.note = note;
  },
  setIsOwnCategory(s, isOwnCategory) {
    s.isOwnCategory = isOwnCategory;
  },
  setIsNote(s, isNote) {
    s.isNote = isNote;
  },
  setCoords(s, pos) {
    s.businessPosition = pos;
    s.lat = pos.lat;
    s.lon = pos.lng;
  },
  setAddress(s, address) {
    s.address = address;
  },
  setDetails(s, details) {
    s.details = details;
  },
  setOsmId(s, id) {
    s.osmId = id;
  },
  setIsNew(s, isNew) {
    s.isNew = isNew;
  },
  setNoteId(s, noteId) {
    s.noteId = noteId;
  },
  setIsEditingUnsavedChanges(s, isEditingUnsavedChanges) {
    s.isEditingUnsavedChanges = isEditingUnsavedChanges;
  },
  setIsFormSubmission(s, isFormSubmission) {
    s.isFormSubmission = isFormSubmission;
  },
  showPopup(s, text) {
    s.infoText = text;
    s.isPopup = true;
  },
  hidePopup(s) {
    s.infoText = '';
    s.isPopup = false;
  },
  setOsmType(s, osmType) {
    s.osmType = osmType;
  },
  resetDetailState(s) {
    Object.keys(initialState).forEach((key) => {
      s[key] = initialState[key];
    });
  },
  restoreDetailState(s) {
    const unsavedChanges = JSON.parse(localStorage.getItem('unsavedChanges'));
    Object.keys(unsavedChanges).forEach((key) => {
      s[key] = unsavedChanges[key];
    });
  },
};

const getters = {
  lat(s) {
    return s.lat;
  },
  lon(s) {
    return s.lon;
  },
  businessPosition(s) {
    if (!s.businessPosition) {
      return latLng(s.lat, s.lon);
    }
    return s.businessPosition;
  },
  details(s) {
    return s.details;
  },
  address(s) {
    return s.address;
  },
  note(s) {
    return s.note;
  },
  isOwnCategory(s) {
    return s.isOwnCategory;
  },
  isPopup(s) {
    return s.isPopup;
  },
  isNote(s) {
    return s.isNote;
  },
  tags(s) {
    return s.tags;
  },
  infoText(s) {
    return s.infoText;
  },
  osmId(s) {
    return s.osmId;
  },
  isNew(s) {
    return s.isNew;
  },
  noteId(s) {
    return s.noteId;
  },
  isEditingUnsavedChanges(s) {
    return s.isEditingUnsavedChanges;
  },
  isFormSubmission(s) {
    return s.isFormSubmission;
  },
  osmType(s) {
    return s.osmType;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
