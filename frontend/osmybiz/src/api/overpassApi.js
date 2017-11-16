import axios from 'axios'
import {overpassUrl} from '../config/config'

export const categoryTags = ['shop', 'amenity', 'tourism', 'office', 'leisure']

const tagRegex = categoryTags.join('|')

const query = `[out:json];node[~"^${tagRegex}$"~"."]({{bbox}});out;`

const filters = [
  {
    key: 'amenity',
    values: [
      'atm', 'bbq', 'bench', 'bicycle_parking', 'bicycle_repair_station', 'clock', 'drinking_water', 'fountain', 'grave_yard',
      'grit_bin', 'hunting_stand', 'motorcycle_parking', 'parking', 'pavilion', 'place_of_worship', 'post_box', 'recycling', 'sanitary_dump_station',
      'shelter', 'shower', 'social_facility', 'swimming_pool', 'toilets', 'vending_machine', 'waste', 'watering_place', 'charging_station'
    ]
  },
  {
    key: 'leisure',
    values: [
      'bird_hide', 'common', 'dog_park', 'firepit', 'fitness_station', 'garden', 'nature_reserve', 'park', 'picnic_table', 'pitch', 'playground',
      'track', 'running_track', 'slipway'
    ]
  }, {
    key: 'tourism',
    values: [
      'picnic_site', 'viewpoint'
    ]
  }
]

function buildQuery (bbox) {
  return query.replace('{{bbox}}', `${bbox.south}, ${bbox.west}, ${bbox.north}, ${bbox.east}`)
}

function parseData (data) {
  return data.elements.map(e => {
    return {
      id: e.id,
      lat: e.lat,
      lng: e.lon,
      tags: e.tags
    }
  })
}

function filterFn (node) {
  for (const f of filters) {
    if (node.tags.hasOwnProperty(f.key)) {
      for (const v of f.values) {
        if (node.tags[f.key].indexOf(v) === 0) {
          return false
        }
      }
    }
  }
  return true
}

export function queryBox (bbox) {
  return axios.post(overpassUrl, buildQuery(bbox)).then(res => {
    return parseData(res.data).filter(filterFn)
  }, (err) => {
    console.log(err)
    return []
  })
}
