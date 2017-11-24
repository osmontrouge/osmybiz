import * as L from 'leaflet'
import {mapBoxToken} from '../config/config'
import {reverseQuery} from './../api/nominatimApi'
import * as $ from 'jquery'
import {getTagName} from './translate'
import {categoryTags} from './../api/overpassApi'
import {getNodeCategoryKey} from './overPassNodeUtils'

const mapbox = 'https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.jpg70?access_token=' + mapBoxToken
const osm = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'

export const tileUrls = {
  tiles: osm,
  satellite: mapbox
}

export function getTileUrl (mode) {
  return tileUrls[mode]
}

export function makeTileLayer (mode) {
  return L.tileLayer(tileUrls[mode], {})
}

function loadAddress (coords) {
  return reverseQuery(coords.lat, coords.lng).then(address => {
    return $(`<div class="popup-entry">${address.street} ${address.housenumber}, ${address.city}</div>`)
  })
}

const bizMarker = L.icon({
  iconUrl: require('../assets/biz-marker.png'),
  iconSize: [64, 64]
})

function getBizCategory (b) {
  const key = getNodeCategoryKey(b)
  return getTagName(key)
}

function getOtherData (b) {
  const data = $('<div class="popup-data"></div>')
  for (const tag of Object.keys(b.tags)) {
    if (categoryTags.indexOf(tag) === -1 && tag !== 'name') {
      const entry = $(`<div class="popup-entry">${tag}: ${b.tags[tag]}</div>`)
      data.append(entry)
    }
  }
  return data
}

function getTitle (title) {
  return $(`<div class="popup-title">${title}</div>`)
}

function getWrapper () {
  return $('<div class="popup-data"></div>')
}

function createButton (text, isLoggedIn, callback, arg) {
  const btn = $(`<button class="popup-btn">${text}</button>`).click(() => {
    callback(arg)
  })
  if (!isLoggedIn) {
    btn.attr('disabled', 'disabled')
  }
  return btn
}

function constructNewBusinessPopup (coords, isloggedIn, clickedCallBack) {
  return loadAddress(coords).then(address => {
    const data = getWrapper()
    const title = getTitle('Neues Business')
    const btn = createButton('Erstellen', isloggedIn, clickedCallBack, coords)
    data.append(title)
    data.append(address)
    data.append(btn)

    return data[0]
  })
}

function constructExistingBusinessPopup (business, coords, isloggedIn, clickedCallBack) {
  return loadAddress(coords).then(address => {
    const wrapper = getWrapper()
    const cat = getBizCategory(business)
    const name = business.tags['name'] || ''
    const btn = createButton('Bearbeiten', isloggedIn, clickedCallBack, business)
    const title = getTitle(`${cat.name} ${name}`)

    wrapper.append(title)
    wrapper.append(address)
    wrapper.append(getOtherData(business))
    wrapper.append(btn)

    return wrapper[0]
  })
}

function createExistingBusinessPopup (map, coords, business, isloggedIn, clb) {
  constructExistingBusinessPopup(business, coords, isloggedIn, clb).then(content => {
    L.popup()
      .setLatLng(coords)
      .setContent(content)
      .openOn(map)
  })
}

export function createNewBusinessPopup (map, coords, isloggedIn, clb) {
  constructNewBusinessPopup(coords, isloggedIn, clb).then(content => {
    L.popup()
      .setLatLng(coords)
      .setContent(content)
      .openOn(map)
  })
}

export function createMarker (business, map, isloggedIn, callback) {
  const coords = L.latLng(business.lat, business.lng)
  const m = L.marker(coords, {
    icon: bizMarker
  })
  m.on('click', () => {
    createExistingBusinessPopup(map, coords, business, isloggedIn, callback)
  })
  return m
}
