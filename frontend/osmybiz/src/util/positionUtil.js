import {initialPosition, initialZoom} from '../config/config'
import * as _ from 'lodash'
import {latLng} from 'leaflet'
import {routes} from '../router'

function fallBackPosition () {
  return {
    cords: initialPosition,
    zoom: initialZoom
  }
}

const positionKey = 'MAP_POSITION_KEY'
const zoomOnSpecifigLocation = 18

function getStoredPosition () {
  const stored = JSON.parse(localStorage.getItem(positionKey))

  if (stored && stored.cords && _.isNumber(stored.zoom) && _.isNumber(stored.cords.lat) && _.isNumber(stored.cords.lng)) {
    return stored
  }
  return null
}

export function storeViewPort (bbox, zoom, $router) {
  const lat = (bbox._northEast.lat + bbox._southWest.lat) / 2
  const lng = (bbox._northEast.lng + bbox._southWest.lng) / 2

  storePosition(latLng(lat, lng), zoom)

  $router.push({name: routes.Landing, params: { zoom: zoom, lat: lat, lng: lng }})
}

function storePosition (cords, zoom) {
  const pos = {
    cords: cords,
    zoom: zoom
  }
  localStorage.setItem(positionKey, JSON.stringify(pos))
}

function extractHash (params) {
  const zoom = parseInt(params.zoom) || zoomOnSpecifigLocation
  const lat = parseFloat(params.lat)
  const lng = parseFloat(params.lng)

  if (!isNaN(lat) && !isNaN(lng)) {
    return {
      cords: latLng(lat, lng),
      zoom: zoom
    }
  }
  return null
}

function getBrowserLocation () {
  return new Promise(resolve => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((location) => {
        const pos = {
          cords: latLng(location.coords.latitude, location.coords.longitude),
          zoom: zoomOnSpecifigLocation
        }
        resolve(pos)
      }, () => {
        resolve(null)
      }, {
        timeout: 5000
      })
    } else {
      resolve(null)
    }
  })
}

export function getInitialPosition (params) {
  return new Promise(resolve => {
    const fromUrl = extractHash(params)

    if (_.isObject(fromUrl)) {
      console.log('picked url from route')
      resolve(fromUrl)
      return
    }

    const stored = getStoredPosition()

    if (_.isObject(stored)) {
      console.log('picked url from store')
      resolve(stored)
      return
    }

    getBrowserLocation().then(pos => {
      if (_.isObject(pos)) {
        console.log('picked url from browser')
        resolve(pos)
      } else {
        console.log('picked fallback url')
        resolve(fallBackPosition())
      }
    })
  })
}
