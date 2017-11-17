var jsonfile = require('jsonfile')

var tags = 'assets/tags.json';
const filters = [
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
            'toilets','vending_machine', 'waste', 'water_point', 'watering_place',
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

function isNecessary (key) {
    return filters.some(function (f) {
        return f.values.some(function (v) {
            return key.indexOf(f.key + "/" + v) > -1;
        })
    })
}

jsonfile.readFile(tags, function (err, obj) {
    var data = {}

    var keys = Object.keys(obj)

    keys.forEach(function (key) {
        if (!isNecessary(key)) {
            var val = obj[key];
            data[key] = {
                name: val.name,
                fields: val.fields
            }
        }
    });

    var output = '../../frontend/osmybiz/src/assets/tags_de.json';

    jsonfile.writeFile(output, data, function (err) {
        console.error(err)
    })
});