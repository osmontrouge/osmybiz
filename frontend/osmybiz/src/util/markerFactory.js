import * as L from 'leaflet'
import {getTagName} from './translate'
import {categoryTags} from './../api/overpassApi'
import * as $ from 'jquery'
import {getNodeCategoryKey} from './overPassNodeUtils'

const bizMarker = L.icon({
  iconUrl: '../static/biz-marker.png',
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

function popupContent (b, clickedCallBack) {
  const cat = getBizCategory(b)
  const name = b.tags['name'] || ''
  const btn = $('<button class="popup-btn">Bearbeiten</button>').click(() => {
    clickedCallBack(b)
  })
  const label = $(`<div class="popup-title">${cat.name} ${name}</div>`)
  const popup = $('<div class="map-popup"></div>')

  popup.append(label)
  popup.append(getOtherData(b))
  popup.append(btn)

  return popup[0]
}

export function createMarker (data, callback) {
  const m = L.marker(L.latLng(data.lat, data.lng), {
    icon: bizMarker
  })
  m.bindPopup(popupContent(data, callback))
  return m
}
