import * as L from 'leaflet'
import {mapBoxToken} from '../config/config'

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
