import axios from 'axios'
import {filters, overpassUrl} from '../config/config'

export const categoryTags = ['shop', 'amenity', 'tourism', 'office', 'leisure']

const tagRegex = categoryTags.join('|')

const query = `[out:json];node[~"^${tagRegex}$"~"."]({{bbox}});out;`

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

function filterTags (node) {
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
    return parseData(res.data).filter(filterTags)
  }, (err) => {
    console.log(err)
    return []
  })
}
