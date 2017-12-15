import Vue from 'vue';
import * as _ from 'lodash';
import * as moment from 'moment';

Vue.filter('date', (val, format) => {
  if (_.isDate(val)) {
    return moment(val).format(format);
  }
  return val;
});
