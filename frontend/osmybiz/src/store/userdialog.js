/* eslint-disable no-param-reassign */
import { NUM_OF_SECS_TO_SHOW_THE_UNSAVED_CHANGES_NOTIFICATION_DIALOG, NUM_OF_SECS_BEFORE_DELETING_THE_UNSAVED_CHANGES_DATA } from '../config/config';

const state = {
  successMessage: {
    address: '',
    name: '',
    link: '',
    isNote: false,
  },

  displayUnsavedChangesNotification: false,

  showDialogTimeLeft: '',
  timerId: '',
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
  },
  hideUserDialog(s) {
    s.displayUnsavedChangesNotification = false;
    s.successMessage = '';
  },
  setDisplayUnsavedChangesNotification(s, displayUnsavedChangesNotification) {
    s.setDisplayUnsavedChangesNotification = displayUnsavedChangesNotification;
  },
  displayUnsavedChangesNotification(s) {
    clearInterval(s.timerId);
    s.displayUnsavedChangesNotification = true;
    s.showDialogTimeLeft = NUM_OF_SECS_TO_SHOW_THE_UNSAVED_CHANGES_NOTIFICATION_DIALOG;
    s.timerId = setInterval(() => {
      s.showDialogTimeLeft -= 1;
      if (s.showDialogTimeLeft === 0) {
        s.displayUnsavedChangesNotification = false;
      }
      if (s.showDialogTimeLeft === -NUM_OF_SECS_BEFORE_DELETING_THE_UNSAVED_CHANGES_DATA) {
        localStorage.setItem('unsavedChanges', '');
        clearInterval(s.timerId);
      }
    }, 1000);
  },
};

const getters = {
  successMessage(s) {
    return s.successMessage;
  },
  displayUnsavedChangesNotification(s) {
    return s.displayUnsavedChangesNotification;
  },
  showDialogTimeLeft(s) {
    return s.showDialogTimeLeft;
  },
  timerId(s) {
    return s.timerId;
  },
};

export default {
  state,
  mutations,
  getters,
};
