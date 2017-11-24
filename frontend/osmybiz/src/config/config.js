import {latLng} from 'leaflet'

// accesstoken for satellite imagery of mapbox can be generated with mapbox account
export const mapBoxToken = 'pk.eyJ1IjoibXRoaSIsImEiOiJjajlzZHJqZGc2bGRxMnhxbTd0bjVibDNjIn0.11MBq0_6S30JBIw7oo9O7A'

export const initialPosition = latLng(46.87897, 8.23975) // aprox center of switzerland
export const initialZoom = 8

// state for osmApi (dev oder prod)
let state = 'dev'

// osm authentification token and key
export const oauthKey = state === 'dev'
  ? 'IRTx85wq5Mv1TT7gt6iJ1KbPJiUyMmASB8jfuRCK'
  : 'deem7DGxX11rEQZ1SjYQ2lL0O9JCCNtqBzFUePjA'
export const oauthSecret = state === 'dev'
  ? 'tLZgaEwwAHn1eXoc79rsDLqdAwjHCi0Lh38T7ki7'
  : 'umPZIExDrNP4KvcXkhwBNIlH9J8jByPSCSwwL4w9'

// change between development (dev) and production (prod)
export const osmApiLevel = '/api/0.6/'
export const osmUrl = state === 'dev'
  ? 'https://master.apis.dev.openstreetmap.org/'
  : 'https://http://api.openstreetmap.org/'

// nominatim Urls
export const nominatimUrl = 'https://nominatim.openstreetmap.org/search'
export const nominatimReverseUrl = 'http://nominatim.openstreetmap.org/reverse'

// overpass Urls
export const overpassUrl = 'http://overpass.osm.ch/api/interpreter'
