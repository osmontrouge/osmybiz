/* eslint-disable no-param-reassign */
import { latLng } from 'leaflet';
import deepEqual from 'deep-equal';
import { postNode, postNote, getNode, postNoteAsComment } from './../api/osmApi';
import { reverseQuery } from './../api/nominatimApi';
import { getLanguageTags } from './locale';
import { addOrUpdateNode } from './../api/osmybizApi';

let initalOptions = [];

const state = {
  // detailPage
  displaySuccess: false,
  displayUnsavedChangesNotification: false,
  osmId: null,
  isNew: true,
  hasSavedChanges: false,
  isEditingUnsavedChanges: false,

  // DetailForm
  tags: initalOptions,
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
  infoMap: new Map(),

  noteId: null,

  // PostSuccess
  note: {},
  node: {},
};


function constructNote() {
  let text = '#OSMyBiz \n \n';

  if (state.address.length !== 0) {
    let address = '';
    if (state.address.street) {
      address += `${state.address.street} `;
      if (state.address.housenumber) {
        address += `${state.address.housenumber}, `;
      }
    }
    if (state.address.place) {
      address += `${state.address.place}, `;
    }
    if (state.address.postcode) {
      address += `${state.address.postcode} `;
    }
    if (state.address.city) {
      address += `${state.address.city}, `;
    }
    if (state.address.country) {
      address += state.address.country;
    }
    text += `Address: ${address}\n`;
  }
  if (state.details.category.text.length !== 0) {
    if (state.isOwnCategory) {
      text += `Category: ${state.details.category.text}\n`;
    } else {
      const category = state.details.category.value.split('/');
      text += `Category: ${category[0]}:${category[1]}\n`;
    }
  }
  if (state.details.name.length !== 0) {
    text += `Name: ${state.details.name}\n`;
  }
  if (state.details.opening_hours.length !== 0) {
    text += `Opening hours: ${state.details.opening_hours}\n`;
  }
  if (state.details.phone.length !== 0) {
    text += `Phone number: ${state.details.phone}\n`;
  }
  if (state.details.email.length !== 0) {
    text += `Email: ${state.details.email}\n`;
  }
  if (state.details.website.length !== 0) {
    text += `Website: ${state.details.website}\n`;
  }
  if (state.details.wheelchair !== 0) {
    text += `Wheelchair accessible: ${state.details.wheelchair}\n`;
  }
  if (state.details.description.length !== 0) {
    text += `Description: ${state.details.description}\n`;
  }
  if (state.details.note.length > 0) {
    text += `Note: ${state.details.note}\n`;
  }

  if (!state.isOwnCategory) {
    state.details.category.fields.forEach((field) => {
      if (field.value.length !== 0) {
        text += `${field.label}: ${field.value}\n`;
      }
    });
  }

  return {
    lat: state.lat,
    lon: state.lon,
    text,
  };
}

function constructDisplayNote(note) {
  const address = note.text.split('Address: ')[1].split('\n')[0];
  const name = note.text.split('Name: ')[1].split('\n')[0];
  note.text = {
    address,
    name,
  };
  return note;
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

export function loadTags() {
  const tags = getLanguageTags();
  const options = [];
  Object.keys(tags).forEach((key) => {
    const fields = [];
    tags[key].fields.forEach((field) => {
      if (field.options) {
        const fieldOptions = [];
        Object.keys(field.options).forEach((option) => {
          fieldOptions.push({
            key: option,
            text: field.options[option],
          });
        });
        fields.push({
          key: field.key,
          label: field.label,
          type: field.type,
          options: fieldOptions,
          value: '',
        });
      } else {
        fields.push({
          key: field.key,
          label: field.label,
          type: field.type,
          value: '',
        });
      }
    });
    options.push({
      value: key,
      text: tags[key].name,
      fields,
    });
  });

  options.sort((a, b) => {
    if (a.text < b.text) return -1;
    if (a.text > b.text) return 1;
    return 0;
  });

  if (state) {
    state.tags = options;
    state.tags.forEach((tag) => {
      if (tag.value === state.details.category.value) {
        const category = {
          fields: tag.fields,
          text: tag.text,
          value: tag.value,
        };
        state.details.category.fields.forEach((field, index) => {
          category.fields[index].value = field.value;
        });
        state.details.category = category;
      }
    });
  } else {
    initalOptions = options;
  }
}

const actions = {
  postNode({ commit }, user) {
    const node = {
      lat: state.lat,
      lon: state.lon,
      details: state.details,
      address: state.address,
    };
    return postNode(node).then((ps) => {
      state.displaySuccess = true;
      commit('setNode', ps);

      return addOrUpdateNode(user.id, {
        lat: parseFloat(ps.lat),
        lng: parseFloat(ps.lon),
        version: parseInt(ps.version, 10),
        osmId: parseInt(ps.id, 10),
        recieveUpdates: true,
        name: ps.details.name,
        noteId: null,
      });
    });
  },
  postNote({ commit }, { user, osmId, noteId }) {
    const note = constructNote();
    const { name } = state.details;

    if (!noteId) {
      return postNote(note).then((ps) => {
        state.displaySuccess = true;
        const displayNote = constructDisplayNote(ps);
        commit('setNote', displayNote);

        return getNode(osmId).then((node) => {
          if (node) {
            addOrUpdateNode(user.id, {
              lat: parseFloat(node.lat),
              lng: parseFloat(node.lon),
              version: parseInt(node.version, 10),
              osmId: parseInt(node.id, 10),
              recieveUpdates: true,
              name,
              noteId: parseInt(displayNote.id, 10),
            });
          }
        });
      });
    }
    return postNoteAsComment(note, noteId).then((ps) => {
      state.displaySuccess = true;
      const displayNote = constructDisplayNote(ps);
      commit('setNote', displayNote);

      return getNode(osmId).then((node) => {
        if (node) {
          addOrUpdateNode(user.id, {
            lat: parseFloat(node.lat),
            lng: parseFloat(node.lon),
            version: parseInt(node.version, 10),
            osmId: parseInt(node.id, 10),
            recieveUpdates: true,
            name,
            noteId: displayNote.id,
          });
        }
      });
    });
  },
  postOwnCategoryNote({ commit }) {
    const note = constructNote();
    return postNote(note).then((ps) => {
      state.displaySuccess = true;
      const displayNote = constructDisplayNote(ps);
      commit('setNote', displayNote);
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
  setNode(s, node) {
    s.node = node;
  },
  setDisplaySuccess(s, displaySuccess) {
    s.displaySuccess = displaySuccess;
  },
  setDisplayUnsavedChangesNotification(s, displayUnsavedChangesNotification) {
    s.displayUnsavedChangesNotification = displayUnsavedChangesNotification;
  },
  setDisplayConfirmation(s, displayConfirmation) {
    s.displayConfirmation = displayConfirmation;
  },
  setIsOwnCategory(s, isOwnCategory) {
    s.isOwnCategory = isOwnCategory;
  },
  setIsPopup(s, isPopup) {
    s.isPopup = isPopup;
  },
  setIsNote(s, isNote) {
    s.isNote = isNote;
  },
  setCoords(s, pos) {
    s.businessPosition = pos;
    s.lat = pos.lat;
    s.lon = pos.lng;
  },
  setInfoMap(s, infoMap) {
    s.infoMap = infoMap;
  },
  setInfoText(s, infoText) {
    s.infoText = infoText;
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
  setHasSavedChanges(s, hasSavedChanges) {
    s.hasSavedChanges = hasSavedChanges;
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
  node(s) {
    return s.node;
  },
  displaySuccess(s) {
    return s.displaySuccess;
  },
  displayUnsavedChangesNotification(s) {
    return s.displayUnsavedChangesNotification;
  },
  displayConfirmation(s) {
    return s.displayConfirmation;
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
  infoMap(s) {
    return s.infoMap;
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
  hasSavedChanges(s) {
    return s.hasSavedChanges;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};

export function showPopup(text) {
  state.infoText = text;
  state.isPopup = true;
}

export function hidePopup() {
  state.isPopup = false;
}

export function getUnsavedChangesFromCookies(context) {
  const unsavedChangesCookie = context.$cookies.get('unsavedChanges');
  context.setDetails(unsavedChangesCookie.details);
  context.setAddress(unsavedChangesCookie.address);
  context.setOsmId(unsavedChangesCookie.osmId);
  context.setIsNote(unsavedChangesCookie.isNote);
  context.setIsOwnCategory(unsavedChangesCookie.isOwnCategory);
  localStorage.setItem('address', JSON.stringify(context.address));
}

