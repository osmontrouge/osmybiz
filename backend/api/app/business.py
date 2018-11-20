from app.models import User, BusinessPoi
from flask import abort
from app.validation import is_user_valid, is_business_poi_valid
from app.serialization import serialize_business_poi, serialize_user,\
    deserialize_business_poi, deserialize_user


def find_user_by_osmid(osmid):
    return User.query.filter(User.osm_id == osmid).first()


def find_business_poi_by_user_and_id(userid, osmid):
    return BusinessPoi.query.filter(BusinessPoi.user_id == userid,
                             BusinessPoi.osm_id == osmid).first()


def find_business_pois_by_user_id(userid):
    return BusinessPoi.query.filter(BusinessPoi.user_id == userid)


def get_all_users():
    users = User.query.all()
    return list(map(lambda u: serialize_user(u), users))


def get_all_business_pois():
    business_pois = BusinessPoi.query.all()
    return list(map(lambda n: serialize_business_poi(n), business_pois))


def add_or_update_user(user_data):

    if not is_user_valid(user_data):
        abort(400)

    user = deserialize_user(user_data)
    existing_user = find_user_by_osmid(user.osm_id)

    if existing_user is None:
        existing_user = user
    else:
        existing_user.osm_name = user.osm_name

    existing_user.save()
    return '', 200


def ensure_user(user_id):
    user = find_user_by_osmid(user_id)

    if user is None:
        abort(404)

    return user


def add_or_update_business_poi(user_id, business_poi_data):

    user = ensure_user(user_id)

    if not is_business_poi_valid(business_poi_data):
        abort(400)

    business_poi = deserialize_business_poi(business_poi_data)
    existing_business_poi = find_business_poi_by_user_and_id(user.id, business_poi.osm_id)

    if existing_business_poi is None:
        existing_business_poi = business_poi
        existing_business_poi.user_id = user.id
    else:
        existing_business_poi.lat = business_poi.lat
        existing_business_poi.lng = business_poi.lng
        existing_business_poi.version = business_poi.version
        existing_business_poi.receive_updates = business_poi.receive_updates
        existing_business_poi.name = business_poi.name
        existing_business_poi.osm_note_id = business_poi.osm_note_id

    existing_business_poi.save()
    if business_poi.osm_id < 0:
        user.temporary_osm_id = user.temporary_osm_id - 1
        user.save()

    return '', 200


def get_business_pois_for_user(user_id):
    user = ensure_user(user_id)

    business_pois = find_business_pois_by_user_id(user.id)
    return list(map(lambda n: serialize_business_poi(n), business_pois))


def get_temporary_osm_id_for_user(user_id):
    user = ensure_user(user_id)
    return user.temporary_osm_id


def load_business_poi(user_id, business_poi_id):
    user = ensure_user(user_id)

    return find_business_poi_by_user_and_id(user.id, business_poi_id)


def unsub_user_from_business_poi(user_id, business_poi_id):
    business_poi = load_business_poi(user_id, business_poi_id)

    if business_poi is None:
        abort(404)

    business_poi.receive_updates = False
    business_poi.save()

    return '', 200


def delete_business_poi(user_id, business_poi_id):

    business_poi = load_business_poi(user_id, business_poi_id)

    if business_poi is not None:
        business_poi.delete()

    return '', 200
