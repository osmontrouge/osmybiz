import { latLng } from 'leaflet';
import store from './../../../../src/store/landing';

describe('landing store', () => {
  describe('mutations', () => {
    it('should set positions', () => {
      const state = {};
      const { setMapPosition } = store.mutations;
      setMapPosition(state, latLng(1, 1));
      expect(state.mapPosition.lat).to.equal(1);
      expect(state.mapPosition.lng).to.equal(1);
    });
  });
});
