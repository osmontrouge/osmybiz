import store from '@/store/landing'
import {latLng} from 'leaflet'

describe('landing store', () => {
  describe('mutations', () => {
    it('should set positions', () => {
      const state = {}
      const {setPosition} = store.mutations
      setPosition(state, latLng(1, 1))
      expect(state.position.lat).to.equal(1)
      expect(state.position.lng).to.equal(1)
    })
  })
})
