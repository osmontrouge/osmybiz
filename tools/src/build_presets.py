import json
import argparse

key_whitelist = ['amenity', 'shop', 'leisure', 'office', 'tourism']

blacklisted_values_per_key = {
    "amenity": [
        'atm', 'bbq', 'bench', 'bicycle_parking',
        'bicycle_repair_station', 'charging_station',
        'clock', 'compressed_air', 'coworking_space',
        'drinking_water', 'fountain', 'grave_yard',
        'grit_bin', 'hunting_stand', 'motorcycle_parking',
        'parking', 'parking_entrance', 'parking_space',
        'pavilion', 'post_box', 'public_bath',
        'recycling', 'public_bookcase', 'sanitary_dump_station',
        'shelter', 'shower', 'swimming_pool', 'telephone',
        'toilets', 'vending_machine', 'waste', 'water_point',
        'watering_place', 'waste_basket', 'waste_disposal',
        'waste_transfer_station', 'place_of_worship', 'social_facility',
    ],
    "leisure": [
        'bird_hide', 'common', 'dog_park', 'firepit',
        'fitness_station', 'garden', 'nature_reserve',
        'park', 'picnic_table', 'pitch', 'playground',
        'track', 'running_track', 'slipway', 'swimming_pool'
    ],
    "office": ['company', 'coworking'],
    "shop": ['vacant'],
    "tourism": ['picnic_site', 'viewpoint', 'information', 'artwork'],
}

field_blacklist = [
    'name', 'address', 'building_area',
    'opening_hours', 'website', 'phone',
    'wheelchair'
]


def load_json(path):
    with open(path, encoding='utf8') as raw:
        return json.load(raw)


def split_osm_tag(osm_tag):
    split = osm_tag.split('/')
    if len(split) != 2:
        return None
    return (split[0], split[1])


def has_relevant_key(tag):
    return tag[0] in key_whitelist


def has_relevant_value(tag):
    blacklist = blacklisted_values_per_key.get(tag[0], [])
    return tag[1] not in blacklist


def load_preset_locale(lang):
    path = '../assets/locales/' + lang + '.json'
    return load_json(path).get(lang, {}).get('presets', {})


def read_lang():
    parser = argparse.ArgumentParser()
    parser.add_argument("language")
    args = parser.parse_args()
    return args.language


def load_field_data():
    return load_json('../assets/fields.json').get('fields', {})


def translateTag(locale, tag):
    return locale.get(tag, {}).get('name')


def is_blacklisted(field_key):
    return field_key in field_blacklist


def translate_field(key, locale):
    return locale.get(key, {}).get('label')


def extract_options(field, key, field_locale):
    options = field.get('strings', {}).get('options', {})

    option_locales = field_locale.get(key, {}).get('options', {})

    result = {}

    for option, _ in options.items():
        name = option_locales.get(option)

        if name is not None:
            result[option] = name

    return result


def extract_field_info(tag_data, field_data, field_locale):
    field_list = tag_data.get('fields', [])

    result = []
    for field_key in field_list:

        if is_blacklisted(field_key):
            continue

        field = field_data.get(field_key, {})

        label = translate_field(field_key, field_locale)

        data = {
            "key": field_key,
            "label": label,
            "type": field.get('type', "")
        }

        options = extract_options(field, field_key, field_locale)

        if len(options) > 0:
            data['options'] = options

        result.append(data)

    return result


def run():
    presets = load_json('../assets/presets.json').get('presets', {})
    lang = read_lang()
    locale = load_preset_locale(lang)
    field_data = load_field_data()

    field_locale = locale.get('fields', {})
    tag_locale = locale.get('presets', {})

    result = {}
    keys = []

    for osm_tag, tag_data in presets.items():

        if '/' not in osm_tag:
            continue

        tag = split_osm_tag(osm_tag)

        if tag is None:
            continue

        if not has_relevant_key(tag):
            continue

        if not has_relevant_value(tag):
            continue

        keys.append(tag[0] + '=' + tag[1])
        name = translateTag(tag_locale, osm_tag)

        if name is None:
            continue

        tags = extract_field_info(tag_data, field_data, field_locale)

        result[osm_tag] = {
            'name': name,
            'fields': tags
        }

    out_path = '../../frontend/osmybiz/src/assets/tags/' + lang + '.json'
    with open(out_path, 'w', encoding="utf8") as outfile:
        json.dump(result, outfile, ensure_ascii=False, indent=2)

    tags_text = ',\n'.join(sorted(keys))
    key_out_path = '../../frontend/osmybiz/tags.md'
    with open (key_out_path, 'w', encoding='utf8') as key_file:
        key_file.write('## Tags supported by OSMyBiz\n\n')
        key_file.write(tags_text)


run()
