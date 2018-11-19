import sys

user_fields = {
    'osmId': {int},
    'username': {str},
}


node_fields = {
    'osmId': {int},
    'noteId': {int, type(None)},
    'lat': {float},
    'lng': {float},
    'version': {int},
    'receiveUpdates': {bool},
    'name': {str},
}


def check_fields(obj, required_fields):
    for field_name, field_types in required_fields.items():
        if field_name not in obj or not (type(obj[field_name]) in field_types):
            print('{} is invalid'.format(field_name), file=sys.stderr)
            return False
    return True


def is_user_valid(user):
    return check_fields(user, user_fields)


def is_node_valid(node):
    return check_fields(node, node_fields)
