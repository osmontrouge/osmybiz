import * as L from 'leaflet'

const token = 'pk.eyJ1IjoibXRoaSIsImEiOiJjajlzZHJqZGc2bGRxMnhxbTd0bjVibDNjIn0.11MBq0_6S30JBIw7oo9O7A'
const mapbox = 'https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.jpg70?access_token=' + token
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
