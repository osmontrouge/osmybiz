import axios from 'axios'

const tags = ['shop', 'amenity', 'tourism'].join('|')

const query = `[out:json];node[~"^${tags}$"~"."]({{bbox}});out;`

const url = 'http://overpass.osm.ch/api/interpreter'

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

export function queryBox (bbox) {
  return axios.post(url, buildQuery(bbox)).then(res => {
    return parseData(res.data)
  }, (err) => {
    console.log(err)
    return []
  })
}
