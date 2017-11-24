import axios from 'axios'
import {overpassUrl} from '../config/config'
import tags from '../assets/tags_de'

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
  for (const f of Object.keys(tags)) {
    const element = f.split('/')
    const key = element[0]
    const value = element[1]
    if (node.tags.hasOwnProperty(key)) {
      if (node.tags[key].indexOf(value) === 0) {
        return true
      }
    }
  }
  return false
}

export function queryBox (bbox) {
  return axios.post(overpassUrl, buildQuery(bbox)).then(res => {
    return parseData(res.data).filter(filterTags)
  }, (err) => {
    console.log(err)
    return []
  })
}
