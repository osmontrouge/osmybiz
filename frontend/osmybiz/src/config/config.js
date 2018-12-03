import { latLng } from 'leaflet';

// accesstoken for satellite imagery of mapbox can be generated with mapbox account
export const mapBoxToken = 'pk.eyJ1IjoibXRoaSIsImEiOiJjajlzZHJqZGc2bGRxMnhxbTd0bjVibDNjIn0.11MBq0_6S30JBIw7oo9O7A';

// export const initialPosition = latLng(46.87897, 8.23975) // aprox center of switzerland
// export const initialZoom = 8
export const initialPosition = latLng(46.87897, 8.23975);
export const initialZoom = 11;

export const LatLngRoundingAccuracy = 5;
export const searchradius = 10.0;

// change between development (dev) and production (prod)
export const osmApiLevel = '/api/0.6/';
export const osmUrl = process.env.OSM_URL;

export const oauthSecret = process.env.OSM_OAUTH_SECRET;
export const oauthKey = process.env.OSM_OAUTH_KEY;

// nominatim Urls
export const nominatimUrl = 'https://nominatim.openstreetmap.org/search';
export const nominatimReverseUrl = 'https://nominatim.openstreetmap.org/reverse';

// overpass api url
export const overpassUrl = 'https://lz4.overpass-api.de/api/interpreter';

// fake the osmybiz backend with localstorage
export const fakeOsmybizApi = false;
export const osmyBizBackendUrl = process.env.API_URL;

export const UNSAVEDCHANGESTIME = 30;
export const SECONDS_TO_WIPE_OUT_THE_UNSAVED_CHANGES = 2;
