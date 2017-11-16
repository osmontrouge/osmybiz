// accesstoken for satellite imagery of mapbox can be generated with mapbox account
export const mapBoxToken = 'pk.eyJ1IjoibXRoaSIsImEiOiJjajlzZHJqZGc2bGRxMnhxbTd0bjVibDNjIn0.11MBq0_6S30JBIw7oo9O7A'

// osm authentification token and key
export const oauthKey = 'deem7DGxX11rEQZ1SjYQ2lL0O9JCCNtqBzFUePjA'
export const oauthSecret = 'umPZIExDrNP4KvcXkhwBNIlH9J8jByPSCSwwL4w9'

// change between development (dev) and production (prod)
let state = 'dev'
export const osmUrl = state === 'dev'
  ? 'https://master.apis.dev.openstreetmap.org/api/0.6/'
  : 'https://http://api.openstreetmap.org/api/0.6/'

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
      'atm', 'bbq', 'bench', 'bicycle_parking', 'bicycle_repair_station', 'clock', 'drinking_water', 'fountain', 'grave_yard',
      'grit_bin', 'hunting_stand', 'motorcycle_parking', 'parking', 'pavilion', 'place_of_worship', 'post_box', 'recycling', 'sanitary_dump_station',
      'shelter', 'shower', 'social_facility', 'swimming_pool', 'toilets', 'vending_machine', 'waste', 'watering_place', 'charging_station'
    ]
  },
  {
    key: 'leisure',
    values: [
      'bird_hide', 'common', 'dog_park', 'firepit', 'fitness_station', 'garden', 'nature_reserve', 'park', 'picnic_table', 'pitch', 'playground',
      'track', 'running_track', 'slipway'
    ]
  }, {
    key: 'tourism',
    values: [
      'picnic_site', 'viewpoint'
    ]
  }
]
