import axios from 'axios'
import {latLng} from 'leaflet'
import * as _ from 'lodash'

const baseUrl = 'https://nominatim.openstreetmap.org/search'
const reverseBaseUrl = 'http://nominatim.openstreetmap.org/reverse'
const queryMax = 10

function parseCoords (lat, lng) {
  const latNr = parseFloat(lat)
  const lngNr = parseFloat(lng)

  if (isNaN(latNr) || isNaN(lngNr)) {
    return null
  }

  return latLng(latNr, lngNr)
}

function mapResults (results) {
  let points = results.map(point => {
    return {
      coords: parseCoords(point.lat, point.lon),
      osmId: point.osm_id,
      address: parseAddress(point.address)
    }
  }).filter(p => _.isObject(p.coords) && p.address.city !== undefined)
  if (points.length === 5) {
    return points
  } else {
    return points.splice(0, 5)
  }
}

function buildRequest (query, count) {
  count = count > queryMax ? queryMax : count
  return `${baseUrl}?format=json&q=${query}&limit=${count}&addressdetails=1`
}

export function query (queryString) {
  return axios.get(buildRequest(queryString, 7))
    .then(response => {
      return mapResults(response.data)
    })
    .catch(e => {
      console.log(e)
    })
}

function parseAddress (data) {
  let street = data.pedestrian ? data.pedestrian : data.road ? data.road : data.suburb ? data.suburb : data.footway
  let housenumber = data.house_number
  let postcode = data.postcode
  let city = data.city ? data.city : data.village ? data.village : data.town ? data.town : data.hamlet
  let country = data.country

  return {
    street: street,
    housenumber: housenumber,
    postcode: postcode,
    city: city,
    country: country
  }
}

function buildReverseRequest (lat, lon) {
  return `${reverseBaseUrl}?format=json&lat=${lat}&lon=${lon}&addressdetails=1&zoom=18`
}

export function reverseQuery (lat, lon) {
  return axios.get(buildReverseRequest(lat, lon))
    .then(response => {
      return parseAddress(response.data.address)
    })
    .catch(e => {
      console.log(e)
    })
}
