import { latLng } from 'leaflet';

// accesstoken for satellite imagery of mapbox can be generated with mapbox account
export const mapBoxToken = 'pk.eyJ1IjoibXRoaSIsImEiOiJjajlzZHJqZGc2bGRxMnhxbTd0bjVibDNjIn0.11MBq0_6S30JBIw7oo9O7A';

export const initialPosition = latLng(46.87897, 8.23975); // aprox center of switzerland
export const initialZoom = 8;

// state for osmApi (dev oder prod)
const state = 'dev';

// change between development (dev) and production (prod)
export const osmApiLevel = '/api/0.6/';
export const osmUrl = state === 'dev'
  ? 'https://master.apis.dev.openstreetmap.org'
  : 'https://api.openstreetmap.org';

// oauth dev
// export const oauthSecret = 'tLZgaEwwAHn1eXoc79rsDLqdAwjHCi0Lh38T7ki7';
// export const oauthKey = 'IRTx85wq5Mv1TT7gt6iJ1KbPJiUyMmASB8jfuRCK';

// oauth staging
export const oauthSecret = 'yjVBypkpNyJJbHlcoXA1SqyrmwdhAEL9pBNwitQ4';
export const oauthKey = 'ZNNKpkLgobvrDT68TZzu5Dy94zvhn3TQ9qErsoLW';

// nominatim Urls
export const nominatimUrl = 'https://nominatim.openstreetmap.org/search';
export const nominatimReverseUrl = 'https://nominatim.openstreetmap.org/reverse';

// overpass api url
export const overpassUrl = 'https://overpass.osm.ch/api/interpreter';
export const searchradius = 10.0;

// fake the osmybiz backend with localstorage
export const fakeOsmybizApi = false;

// export const osmyBizBackendUrl = 'http://localhost:8080'
export const osmyBizBackendUrl = 'https://osmybiz.infs.ch';
