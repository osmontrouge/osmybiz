import { latLng } from 'leaflet';
import store from './../../../../src/store/landing';

describe('landing store', () => {
  describe('mutations', () => {
    it('should set positions', () => {
      const state = {};
      const { setMapCenter } = store.mutations;
      setMapCenter(state, latLng(1, 1));
      expect(state.mapCenter.lat).to.equal(1);
      expect(state.mapCenter.lng).to.equal(1);
    });
  });
});
