import * as store from '@/store/landing'
import {latLng} from 'leaflet'

describe('landing store', () => {
  describe('mutations', () => {
    it('should set positions', () => {
      const state = {}

      console.log(store.default.state)

      const {setPosition} = store.default.mutations
      setPosition(state, latLng(1, 1))

      console.log(state)
      expect(state.position.lat).to.equal(1)
      expect(state.position.lng).to.equal(1)
    })
  })
})
