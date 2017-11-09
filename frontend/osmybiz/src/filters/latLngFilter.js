import Vue from 'vue'
import * as _ from 'lodash'
import {LatLngRoundingAccuracy} from './../constants'

Vue.filter('latLng', (val) => {
  if (_.isNumber(val)) {
    return val.toFixed(LatLngRoundingAccuracy)
  }
  return val
})
