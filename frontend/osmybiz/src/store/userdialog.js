/* eslint-disable no-param-reassign */
import { NUM_OF_SECS_TO_SHOW_THE_UNSAVED_CHANGES_NOTIF_DIALOG, NUM_OF_SECS_BEFORE_DELETING_THE_UNSAVED_CHANGES_DATA } from '../config/config';

const state = {
  isShowSuccessMessage: false,
  successMessage: {
    address: '',
    name: '',
    link: '',
    isNote: false,
  },

  isShowUnsavedChangesNotification: false,

  showDialogTimeLeft: '',
  timer: '',
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
    clearInterval(s.timer);
    s.isShowUnsavedChangesNotification = true;
    s.showDialogTimeLeft = NUM_OF_SECS_TO_SHOW_THE_UNSAVED_CHANGES_NOTIF_DIALOG;
    s.timer = setInterval(() => {
      s.showDialogTimeLeft -= 1;
      if (s.showDialogTimeLeft === 0) {
        s.isShowUnsavedChangesNotification = false;
      }
      if (s.showDialogTimeLeft === -NUM_OF_SECS_BEFORE_DELETING_THE_UNSAVED_CHANGES_DATA) {
        localStorage.setItem('unsavedChanges', '');
        clearInterval(s.timer);
      }
    }, 1000);
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
  showDialogTimeLeft(s) {
    return s.showDialogTimeLeft;
  },
  timer(s) {
    return s.timer;
  },
};

export default {
  state,
  mutations,
  getters,
};
