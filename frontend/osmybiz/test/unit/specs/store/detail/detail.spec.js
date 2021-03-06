import { latLng } from 'leaflet';
import store from './../../../../../src/store/detail';

describe('detail store', () => {
  describe('mutations', () => {
    it('should set note', () => {
      const state = {};
      const { setNote } = store.mutations;
      const note = {
        test: 'test',
      };
      setNote(state, note);
      expect(state.note.test).to.equal('test');
    });

    it('should set coords', () => {
      const state = {};
      const { setCoords } = store.mutations;
      const pos = latLng(1, 1);
      setCoords(state, pos);
      expect(state.lat).to.equal(1);
      expect(state.lon).to.equal(1);
    });
  });

  describe('getters', () => {
    it('should get static variables', () => {
      const state = {
        tags: [0, 1, 2],
        lat: 1,
        lon: 1,
        details: {
          category: {
            text: 'text',
            value: 0,
          },
          name: 'name',
          openinghours: 'openinghours',
          phonenumber: 'phonenumber',
          email: 'email',
          website: 'website',
          wheelchair: false,
          description: 'description',
          note: 'note',
        },
      };

      const lat = store.getters.lat(state);
      const lon = store.getters.lon(state);
      const details = store.getters.details(state);
      const tags = store.getters.tags(state);
      expect(state.lat).to.equal(lat);
      expect(state.lon).to.equal(lon);
      expect(state.details.name).to.equal(details.name);
      expect(state.details.wheelchair).to.equal(details.wheelchair);
      expect(state.tags[2]).to.equal(tags[2]);
    });
  });
});
