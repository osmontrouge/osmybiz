from app.models import User, BusinessPOI


def serialize_user(user):
    return {
        'osmId': user.osm_id,
        'username': user.osm_name
    }


def deserialize_user(user_data):
    return User(user_data['osmId'], user_data['username'])


def serialize_business_poi(business_poi):
    return {
        'lat': business_poi.lat,
        'lng': business_poi.lng,
        'name': business_poi.name,
        'noteId': business_poi.osm_note_id,
        'osmId': business_poi.osm_id,
        'osmType': business_poi.osm_type,
        'receiveUpdates': business_poi.receive_updates,
        'version': business_poi.version,
    }


def deserialize_business_poi(business_poi_data):
    return BusinessPOI(
        0,
        business_poi_data['lat'],
        business_poi_data['lng'],
        business_poi_data['name'],
        business_poi_data['noteId'],
        business_poi_data['osmId'],
        business_poi_data['osmType'],
        business_poi_data['receiveUpdates'],
        business_poi_data['version'],
    )
