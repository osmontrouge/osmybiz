/* eslint-disable no-param-reassign */
import { latLng } from 'leaflet';
import deepEqual from 'deep-equal';
import { postNode, postNote, getNode, postNoteAsComment } from './../api/osmApi';
import { reverseQuery } from './../api/nominatimApi';
import { getLanguageTags } from './locale';
import { addOrUpdateNode, getTemporaryOsmId } from './../api/osmybizApi';

let initialOptions = [];

const state = {
  // detailPage
  displaySuccess: false,
  displayUnsavedChangesNotification: false,
  osmId: null,
  osmType: null,
  isNew: true,
  hasSavedChanges: false,
  isEditingUnsavedChanges: false,

  // DetailForm
  tags: initialOptions,
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
    initialOptions = options;
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
        receiveUpdates: true,
        name: ps.details.name,
        noteId: null,
        osmType: 'node',
      });
    });
  },
  /* eslint-disable-next-line object-curly-newline */
  postNote({ commit }, { user, osmId, noteId, osmType }) {
    const note = constructNote();
    const { name } = state.details;

    if (!noteId) {
      return postNote(note).then((ps) => {
        state.displaySuccess = true;
        const displayNote = constructDisplayNote(ps);
        commit('setNote', displayNote);

        if (osmId) {
          return getNode(osmType, osmId).then((node) => {
            if (node) {
              if (node.lat === undefined && node.lng === undefined) {
                node.lat = state.lat;
                node.lon = state.lon;
              }
              addOrUpdateNode(user.id, {
                name,
                osmId: parseInt(node.id, 10),
                osmType,
                noteId: parseInt(displayNote.id, 10),
                lat: parseFloat(node.lat),
                lng: parseFloat(node.lon),
                version: parseInt(node.version, 10),
                receiveUpdates: true,
              });
            }
            // TODO handle error status code 410 if the element has been deleted
          });
        }
        return getTemporaryOsmId(user.id).then((temporaryOsmId) => {
          addOrUpdateNode(user.id, {
            lat: parseFloat(state.lat),
            lng: parseFloat(state.lon),
            receiveUpdates: true,
            version: 0,
            name,
            osmId: temporaryOsmId,
            noteId: parseInt(displayNote.id, 10),
            osmType,
          });
        });
      });
    }
    return postNoteAsComment(note, noteId).then((ps) => {
      state.displaySuccess = true;
      const displayNote = constructDisplayNote(ps);
      commit('setNote', displayNote);

      return getNode(osmType, osmId).then((node) => {
        if (node) {
          addOrUpdateNode(user.id, {
            lat: parseFloat(node.lat),
            lng: parseFloat(node.lon),
            version: parseInt(node.version, 10),
            osmId: parseInt(node.id, 10),
            receiveUpdates: true,
            name,
            noteId: displayNote.id,
            osmType,
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
  setHasSavedChanges(s, hasSavedChanges) {
    s.hasSavedChanges = hasSavedChanges;
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
  hasSavedChanges(s) {
    return s.hasSavedChanges;
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

export function getUnsavedChangesFromCookies(context) {
  const unsavedChangesCookie = context.$cookies.get('unsavedChanges');
  context.setDetails(unsavedChangesCookie.details);
  context.setAddress(unsavedChangesCookie.address);
  context.setOsmId(unsavedChangesCookie.osmId);
  context.setIsNote(unsavedChangesCookie.isNote);
  context.setNoteId(unsavedChangesCookie.noteId);
  context.setIsOwnCategory(unsavedChangesCookie.isOwnCategory);
  context.setOsmType(unsavedChangesCookie.osmType);
  localStorage.setItem('address', JSON.stringify(context.address));
}

