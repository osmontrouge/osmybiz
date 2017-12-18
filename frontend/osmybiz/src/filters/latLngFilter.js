import Vue from 'vue';
import * as _ from 'lodash';
import { LatLngRoundingAccuracy } from '../config/config';

Vue.filter('latlng', (val) => {
  if (_.isObject(val) && _.isNumber(val.lat) && _.isNumber(val.lng)) {
    return `${val.lat.toFixed(LatLngRoundingAccuracy)}/${val.lng.toFixed(LatLngRoundingAccuracy)}`;
  }
  return val;
});
