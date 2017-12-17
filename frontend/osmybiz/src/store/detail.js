/* eslint-disable no-param-reassign */
import { postNode, postNote, getNode } from './../api/osmApi';
import { reverseQuery } from './../api/nominatimApi';
import { getLanguageTags } from './locale';
import { addOrUpdateNode } from './../api/osmybizApi';

let initalOptions = [];

const state = {
  // detailPage
  displaySuccess: false,
  osmId: null,

  // DetailForm
  tags: initalOptions,
  address: {},
  lat: null,
  lon: null,
  details: {
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
  },
  isOwnCategory: false,
  isPopup: false,
  isNote: false,
  infoText: '',
  infoMap: new Map(),

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
    } else {
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
    const category = state.details.category.value.split('/');
    text += `Category: ${category[0]}:${category[1]}\n`;
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

  state.details.category.fields.forEach((field) => {
    if (field.value.length !== 0) {
      text += `${field.label}: ${field.value}\n`;
    }
  });

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

loadTags();

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
      });
    });
  },
  postNote({ commit }, { user, osmId }) {
    const note = constructNote();
    const name = state.details.name;
    return postNote(note).then((ps) => {
      state.displaySuccess = true;
      const displayNote = constructDisplayNote(ps);
      commit('setNote', displayNote);

      return getNode(osmId).then(node => addOrUpdateNode(user.id, {
        lat: parseFloat(node.lat),
        lng: parseFloat(node.lon),
        version: parseInt(node.version, 10),
        osmId: parseInt(node.id, 10),
        recieveUpdates: true,
        name,
      }));
    });
  },
  getAddress({ commit }) {
    reverseQuery(state.lat, state.lon).then((ps) => {
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
};

const getters = {
  lat(s) {
    return s.lat;
  },
  lon(s) {
    return s.lon;
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
  isLoading(s) {
    return s.isLoading;
  },
  osmId(s) {
    return s.osmId;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};


export function showPopup(key) {
  state.infoText = state.infoMap.get(key);
  state.isPopup = true;
}

export function hidePopup() {
  state.isPopup = false;
}
