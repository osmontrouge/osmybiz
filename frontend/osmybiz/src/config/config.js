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
      'picnic_site', 'viewpoint', 'information'
    ]
  }
]
