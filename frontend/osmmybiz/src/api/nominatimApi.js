import axios from 'axios'
import {latLng} from 'leaflet'
import * as _ from 'lodash'

const baseUrl = 'https://nominatim.openstreetmap.org/search'
const queryMax = 10

function parseCoords (lat, lng) {
  const latNr = parseFloat(lat)
  const lngNr = parseFloat(lng)

  if (isNaN(latNr) || isNaN(lngNr)) {
    return null
  }

  return latLng(latNr, lngNr)
}

function parseName (str) {
  return _.take(str.split(','), 2).join(',')
}

function mapResults (results) {
  return results.map(point => {
    return {
      coords: parseCoords(point.lat, point.lon),
      osmId: point.osm_id,
      name: parseName(point.display_name),
      country: point.address.country
    }
  }).filter(p => _.isObject(p.coords))
}

function buildRequest (query, count) {
  count = count > queryMax ? queryMax : count
  return `${baseUrl}?format=json&q=${query}&limit=${count}&addressdetails=1`
}

export function query (queryString) {
  return axios.get(buildRequest(queryString, 5))
    .then(response => {
      return mapResults(response.data)
    })
    .catch(e => {
      console.log(e)
    })
}

export default {

  loadAddress: (address) => {
    return axios.get(buildRequest(address, 5))
      .catch(e => {
        console.log(e)
      })
  }
}
