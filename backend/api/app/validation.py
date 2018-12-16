import sys

user_fields = {
    'osmId': {int},
    'username': {str},
}


business_poi_fields = {
    'lat': {float},
    'lng': {float},
    'name': {str},
    'noteId': {int, type(None)},
    'osmId': {int},
    'osmType': {str},
    'receiveUpdates': {bool},
    'version': {int},
}


def check_fields(obj, required_fields):
    for field_name, field_types in required_fields.items():
        if field_name not in obj or not (type(obj[field_name]) in field_types):
            print('{} is invalid'.format(field_name), file=sys.stderr)
            return False
    return True


def is_user_valid(user):
    return check_fields(user, user_fields)


def is_business_poi_valid(business_poi):
    return check_fields(business_poi, business_poi_fields)
