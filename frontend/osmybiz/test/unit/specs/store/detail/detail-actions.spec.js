/* eslint-disable import/no-webpack-loader-syntax, import/no-extraneous-dependencies,
import/no-unresolved */

const actionsInjector = require('inject-loader!../../../../../src/store/detail');

const actions = actionsInjector({
  './../api/osmApi': {
    postNote() {
      return Promise.resolve({
        text: '#OSMyBiz \n' +
          'Address: Oberseestrasse 10, 8640 Rapperswil-Jona, Switzerland\n' +
          'Category: amenity:university\n' +
          'Name: HSR Hochschule für Technik Rapperswil\n' +
          'Website: http://www.hsr.ch\n' +
          'Wheelchair accessible: true\n',
        link: 'www.osm.org/note/1',
        id: 1,
      });
    },
  },
});

const testAction = (action, payload, state, expectedMutations, done) => {
  let count = 0;

  // mock commit
  const commit = (type, data) => {
    const mutation = expectedMutations[count];

    try {
      expect(mutation.type).to.equal(type);
      if (data) {
        expect(mutation.payload).to.deep.equal(data);
      }
    } catch (error) {
      done(error);
    }

    count += 1;
    if (count >= expectedMutations.length) {
      done();
    }
  };

  // call the action with mocked store and arguments
  action({ commit, state }, payload);

  // check if no mutations should have been dispatched
  if (expectedMutations.length === 0) {
    expect(count).to.equal(0);
    done();
  }
};

describe('detail store', () => {
  describe('actions', () => {
    it('should post note', (done) => {
      testAction(
        actions.default.actions.postNote,
        { user: {}, osmId: 0 },
        {
          details: {
            category: {
              text: '',
              value: 0,
              fields: [
                { name: '', value: '' },
              ],
            },
            name: '',
            opening_hours: '',
            phone: '',
            email: '',
            website: '',
            wheelchair: false,
            description: '',
            note: '',
          },
        }, [{
          type: 'setSuccessMessage',
          payload: {
            address: 'Oberseestrasse 10, 8640 Rapperswil-Jona, Switzerland',
            name: 'HSR Hochschule für Technik Rapperswil',
            link: 'www.osm.org/note/1',
            isNote: true,
          },
        }], done,
      );
    });
  });
});
