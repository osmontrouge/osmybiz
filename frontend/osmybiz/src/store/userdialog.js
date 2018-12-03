/* eslint-disable no-param-reassign */
import { UNSAVEDCHANGESTIME } from '../config/config';

const state = {
  isShowSuccessMessage: false,
  successMessage: {
    address: '',
    name: '',
    link: '',
    isNote: false,
  },

  isShowUnsavedChangesNotification: false,
};


export function osmNoteResponseToSuccessMessageParser(response) {
  const address = response.text.split('Address: ')[1].split('\n')[0];
  const name = response.text.split('Name: ')[1].split('\n')[0];
  const { link } = response;
  const isNote = true;
  return {
    address,
    name,
    link,
    isNote,
  };
}

export function osmCreateNodeResponseToSuccessMessageParser(response) {
  const {
    address: {
      street,
      housenumber,
      place,
      postcode,
      city,
      country,
    },
    details: { name },
    link,
  }
  = response;

  let address = '';
  if (street) {
    address += street;
    address += housenumber ? ` ${housenumber},` : ',';
  }
  address += place ? ` ${place},` : '';
  address += postcode ? ` ${postcode}` : '';
  address += city ? ` ${city}` : '';
  address += country ? ` ${country}` : '';

  const isNote = false;
  return {
    address,
    name,
    link,
    isNote,
  };
}

const mutations = {
  setSuccessMessage(s, successMessage) {
    s.successMessage = successMessage;
    s.isShowSuccessMessage = true;
  },
  setIsShowSuccessMessage(s, isShowSuccessMessage) {
    s.isShowSuccessMessage = isShowSuccessMessage;
  },
  hideUserDialog(s) {
    s.isShowSuccessMessage = false;
  },
  setIsShowUnsavedChangesNotification(s, isShowUnsavedChangesNotification) {
    s.setIsShowUnsavedChangesNotification = isShowUnsavedChangesNotification;
  },
  showUnsavedChangesNotification(s) {
    s.isShowUnsavedChangesNotification = true;
    setTimeout(() => {
      s.isShowUnsavedChangesNotification = false;
    }, UNSAVEDCHANGESTIME * 1000);
  },
};

const getters = {
  isShowSuccessMessage(s) {
    return s.isShowSuccessMessage;
  },
  successMessage(s) {
    return s.successMessage;
  },
  isShowUnsavedChangesNotification(s) {
    return s.isShowUnsavedChangesNotification;
  },
};

export default {
  state,
  mutations,
  getters,
};
