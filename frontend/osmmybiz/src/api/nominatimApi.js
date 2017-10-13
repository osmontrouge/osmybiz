import axios from 'axios'
import {latLng} from 'leaflet'
import * as _ from 'lodash'

const url = 'https://nominatim.openstreetmap.org/search?format=json&q='

function parseCoords (lat, lng) {
  const latNr = parseFloat(lat)
  const lngNr = parseFloat(lng)

  if (isNaN(latNr) || isNaN(lngNr)) {
    return null
  }

  return latLng(latNr, lngNr)
}

function mapResults (results) {
  return results.map(point => {
    return {
      coords: parseCoords(point.lat, point.lon),
      osmId: point.osm_id,
      name: point.display_name
    }
  }).filter(p => _.isObject(p.coords))
}

export function query (queryString) {
  return axios.get(url + queryString)
    .then(response => {
      return mapResults(response.data)
    })
    .catch(e => {
      console.log(e)
    })
}

export default {

  loadAddress: (address) => {
    return axios.get(url + address)
      .catch(e => {
        console.log(e)
      })
  }
}
