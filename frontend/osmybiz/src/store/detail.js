/* eslint-disable no-param-reassign */
import { latLng } from 'leaflet';
import deepEqual from 'deep-equal';
import { postNode, postNote, getBusinessPOI, postNoteAsComment } from './../api/osmApi';
import { reverseQuery } from './../api/nominatimApi';
import { addOrUpdateBusinessPOI, getTemporaryOsmId } from './../api/osmybizApi';
import { MODIFIED, REMOVED } from '../config/config';

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
      value: '',
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

function getPrettifiedAddress() {
  const {
    street,
    housenumber,
    place,
    postcode,
    city,
    country,
  } = state.address;

  let prettifiedAddress = '';
  if (street) {
    prettifiedAddress += street;
    prettifiedAddress += housenumber ? ` ${housenumber},` : ',';
  }
  prettifiedAddress += place ? ` ${place},` : '';
  prettifiedAddress += postcode ? ` ${postcode}` : '';
  prettifiedAddress += city ? ` ${city}` : '';
  prettifiedAddress += country ? ` ${country}` : '';

  return prettifiedAddress;
}

function constructSuccessMessage(response, isNote) {
  const {
    link,
  } = response;
  const address = getPrettifiedAddress();
  const { name } = state.details;
  const successMessage = {
    address,
    name,
    link,
    isNote,
  };
  return successMessage;
}

function parseTagToString(tag, value, initialValue, additionalText) {
  if (deepEqual(value, initialValue)) {
    if (value) {
      return `${additionalText}${tag}: ${value}\n`;
    }
    return '';
  }
  if (value) {
    return `${MODIFIED}${additionalText}${tag}: ${value}\n`;
  }
  return `${REMOVED}${additionalText}${tag}: ${initialValue}\n`;
}

function insertLineBreak(isNoteAsComment) {
  if (!isNoteAsComment) return '\n \n';
  return '\n';
}

function constructAddrNote(address) {
  let text = '';
  const originalAddress = JSON.parse(localStorage.getItem('address'));
  Object.keys(address).forEach((key) => {
    text += parseTagToString(key, address[key], originalAddress[key], 'addr:');
  });
  return text;
}

function constructDetailNote(details) {
  let text = '';
  const originalDetails = JSON.parse(localStorage.getItem('details'));
  Object.keys(details).forEach((key) => {
    if (key !== 'category') {
      text += parseTagToString(key, details[key], originalDetails[key], '');
    }
  });
  return text;
}

function constructCategoryNote(category, isOwnCategory) {
  let text = '';
  const originalDetails = JSON.parse(localStorage.getItem('details'));
  const originalCategory = originalDetails.category;
  let categoryFormatted = '';

  if (isOwnCategory) {
    text += `${MODIFIED}category: ${category.text}\n`;
  } else {
    let field;
    if (category.value.indexOf('/') !== -1) {
      categoryFormatted = category.value.replace('/', ': ');
    }
    if (deepEqual(category.value, originalCategory.value)) {
      text += `${categoryFormatted}\n`;
      for (let i = 0; i < category.fields.length; i += 1) {
        // the field here is the additonal tag options that is dependant on the category
        field = category.fields[i];
        text += parseTagToString(field.key, field.value, originalCategory.fields[i].value, '');
      }
    } else {
      text += `${MODIFIED}${categoryFormatted}\n`;
      for (let i = 0; i < category.fields.length; i += 1) {
        field = category.fields[i];
        if (field.value) {
          text += `${MODIFIED}${field.key}: ${field.value}\n`;
        }
      }
    }
  }
  return text;
}

function constructNote(isNoteAsComment) {
  let text = 'This is a comment generated by #OSMyBiz.\n';
  text += `Modified Tags = '${MODIFIED}', Removed Tags = '${REMOVED}'.\n \n`;
  const { address, details, details: { category } } = state;

  text += constructAddrNote(address);
  text += insertLineBreak(isNoteAsComment);
  text += constructDetailNote(details);
  text += insertLineBreak(isNoteAsComment);
  text += constructCategoryNote(category, state.isOwnCategory);

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
    return postNode(businessPOI).then((newlyCreatedNode) => {
      const isNote = false;
      const nodeVersion = '0';
      const nodeSuccessMessage = constructSuccessMessage(newlyCreatedNode, isNote);
      commit('setSuccessMessage', nodeSuccessMessage);
      return addOrUpdateBusinessPOI(user.id, {
        lat: parseFloat(newlyCreatedNode.lat),
        lng: parseFloat(newlyCreatedNode.lon),
        name: newlyCreatedNode.details.name,
        noteId: null,
        osmId: parseInt(newlyCreatedNode.id, 10),
        osmType: 'node',
        receiveUpdates: true,
        version: parseInt(nodeVersion, 10),
      });
    });
  },
  /* eslint-disable-next-line object-curly-newline */
  postNote({ commit }, { user, osmId, noteId, osmType }) {
    const { name } = state.details;
    if (!noteId) {
      const note = constructNote(false);
      return postNote(note).then((noteThatWasSent) => {
        const isNote = true;
        const noteSuccessMessage = constructSuccessMessage(noteThatWasSent, isNote);
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
                noteId: parseInt(noteThatWasSent.id, 10),
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
            noteId: parseInt(noteThatWasSent.id, 10),
            osmId: temporaryOsmId,
            osmType,
            receiveUpdates: true,
            version: 0,
          });
        });
      }).catch((err) => {
        console.log(err);
      });
    }
    const note = constructNote(true);
    return postNoteAsComment(note, noteId).then((noteThatWasSent) => {
      const isNote = true;
      const noteSuccessMessage = constructSuccessMessage(noteThatWasSent, isNote);
      commit('setSuccessMessage', noteSuccessMessage);
      if (state.osmType === 'note') {
        return addOrUpdateBusinessPOI(user.id, {
          lat: parseFloat(state.lat),
          lng: parseFloat(state.lon),
          name,
          noteId: parseInt(noteThatWasSent.id, 10),
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
            noteId: noteThatWasSent.id,
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
    reverseQuery(position).then((address) => {
      commit('setAddress', address);
      localStorage.setItem('address', JSON.stringify(address));
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
