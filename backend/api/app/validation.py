import sys

user_fields = {
    'osmId': int,
    'username': str
}


node_fields = {
    'osmId': int,
    'mapNoteId': int,
    'lat': float,
    'lng': float,
    'version': int,
    'recieveUpdates': bool,
    'name': str,
}


def check_fields(obj, required_fields):
    for field_name, field_type in required_fields.items():
        if field_name == 'mapNoteId' and obj[field_name] is None:
            continue
        if field_name not in obj or not isinstance(obj[field_name], field_type):
            print('{} is invalid'.format(field_name), file=sys.stderr)
            return False
    return True


def is_user_valid(user):
    return check_fields(user, user_fields)


def is_node_valid(node):
    return check_fields(node, node_fields)
