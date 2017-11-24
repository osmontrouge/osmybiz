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
  ? 'https://master.apis.dev.openstreetmap.org'
  : 'https://http://api.openstreetmap.org'

// nominatim Urls
export const nominatimUrl = 'https://nominatim.openstreetmap.org/search'
export const nominatimReverseUrl = 'http://nominatim.openstreetmap.org/reverse'

// overpass Urls
export const overpassUrl = 'http://overpass.osm.ch/api/interpreter'

// filter for categories
export const filters = [
  {
    key: 'amenity',
    values: [
      'atm', 'bbq', 'bench', 'bicycle_parking',
      'bicycle_repair_station', 'charging_station',
      'clock', 'compressed_air', 'coworking_space',
      'drinking_water', 'fountain', 'grave_yard',
      'grit_bin', 'hunting_stand', 'motorcycle_parking',
      'parking', 'parking_entrance', 'parking_space',
      'pavilion', 'post_box', 'public_bath',
      'recycling', 'public_bookcase', 'sanitary_dump_station',
      'shelter', 'shower', 'swimming_pool', 'telephone',
      'toilets', 'vending_machine', 'waste', 'water_point', 'watering_place',
      'waste_basket', 'waste_disposal', 'waste_transfer_station'
      // 'place_of_worship', 'social_facility',
    ]
  },
  {
    key: 'leisure',
    values: [
      'bird_hide', 'common', 'dog_park', 'firepit',
      'fitness_station', 'garden', 'nature_reserve',
      'park', 'picnic_table', 'pitch', 'playground',
      'track', 'running_track', 'slipway', 'swimming_pool'
    ]
  }, {
    key: 'office',
    values: [
      'company', 'coworking'
    ]
  }, {
    key: 'shop',
    values: [
      'vacant'
    ]
  }, {
    key: 'tourism',
    values: [
      'picnic_site', 'viewpoint', 'information', 'artwork'
    ]
  }
]
