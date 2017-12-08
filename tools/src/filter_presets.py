import json
import argparse

groups = ['amenity', 'shop', 'leisure', 'office', 'tourism']

filters = [
    {
        'key': 'amenity',
        'values': [
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
                                              'place_of_worship', 'social_facility',
        ]
    },
    {
        'key': 'leisure',
        'values': [
            'bird_hide', 'common', 'dog_park', 'firepit',
            'fitness_station', 'garden', 'nature_reserve',
            'park', 'picnic_table', 'pitch', 'playground',
            'track', 'running_track', 'slipway', 'swimming_pool'
        ]
    }, {
        'key': 'office',
        'values': [
            'company', 'coworking'
        ]
    }, {
        'key': 'shop',
        'values': [
            'vacant'
        ]
    }, {
        'key': 'tourism',
        'values': [
            'picnic_site', 'viewpoint', 'information', 'artwork'
        ]
    }
]

def isNeeded(key):
    isNeeded = False
    for g in groups:
        try:
            index = key.index(g + "/")
            if (index >= 0):
                 return True
        except ValueError:
            isNeeded = False
    return isNeeded

def isNecessary(key):
    isNecessary = True
    for f in filters:
        for v in f['values']:
            try:
                index = key.index(f['key'] + "/" + v)
                if (index >= 0):
                    return False
            except ValueError:
                isNecessary = True
    return isNecessary

filtered_presets = {}

with open('../assets/presets.json', encoding="utf8") as json_file:
    presets = json.load(json_file)

    "filter unneeded groups and unnecessary tags"
    for key in presets['presets']:
        if (isNeeded(key) and isNecessary(key)):
            val = presets['presets'][key]
            try:
                filtered_presets[key] = {
                    'name': val['name'],
                    'fields': val['fields']
                }
            except KeyError:
                filtered_presets[key] = {
                    'name': val['name']
                }

    "filter unneeded fields"
    field_filter = ['name', 'address', 'building_area', 'opening_hours', 'website', 'phone', 'wheelchair']
    for key in filtered_presets:
        filtered_fields = []
        try:
            if (filtered_presets[key]['fields']):
                filtered_fields = [field for field in filtered_presets[key]['fields'] if field not in field_filter]
        except KeyError:
            filtered_fields = []

        filtered_presets[key]['fields'] = filtered_fields

    "add options to the fields"
    presets_withOptions = {}
    with open('../assets/fields.json', encoding="utf8") as json_file:
        fields_data = json.load(json_file)['fields']

        for key in filtered_presets:
            fields = []
            try:
                for field in filtered_presets[key]['fields']:
                    for field_key in fields_data:
                        if (field == field_key):
                            field_data = fields_data[field_key]
                            "print(fields_data[field_key])"
                            try:
                                fields.append({
                                    'key': field,
                                    'type': field_data['type'],
                                    'label': field_data['label'],
                                    'options': field_data['options']
                                })
                            except KeyError:
                                try:
                                    fields.append({
                                        'key': field,
                                        'type': field_data['type'],
                                        'label': field_data['label'],
                                        'options': field_data['strings']['options']
                                    })
                                except KeyError:
                                    fields.append({
                                        'key': field,
                                        'type': field_data['type'],
                                        'label': field_data['label']
                                    })
            except KeyError:
                fields = []

            presets_withOptions[key] = {
                'name': filtered_presets[key]['name'],
                'fields': fields
            }

        "translate everything to the language given in the command line"
        presets_translated = {}

        parser = argparse.ArgumentParser()
        parser.add_argument("language")
        args = parser.parse_args()

        with open('../assets/locales/' + args.language + '.json', encoding="utf8") as json_file:
            data = json.load(json_file)[args.language]['presets']

            for key in presets_withOptions:
                for language_key in data['presets']:
                    if (key == language_key):
                        val = data['presets'][key]
                        fields = []

                        for language_field_key in data['fields']:
                            try:
                                for preset_field in presets_withOptions[key]['fields']:
                                    if (language_field_key == preset_field['key']):
                                        try:
                                            fields.append({
                                                'key': preset_field['key'],
                                                'type': preset_field['type'],
                                                'label': data['fields'][language_field_key]['label'],
                                                'options': data['fields'][language_field_key]['options']
                                            })
                                        except KeyError:
                                            fields.append({
                                                'key': preset_field['key'],
                                                'type': preset_field['type'],
                                                'label': data['fields'][language_field_key]['label']
                                            })
                            except KeyError:
                                fields = []

                        presets_translated[key] = {
                            'name': val['name'],
                            'fields': fields
                        }

with open('../../frontend/osmybiz/src/assets/tags/' + args.language +'.json', 'w', encoding="utf8") as outfile:
    json.dump(presets_translated, outfile)