from app.models import User, Node


def serialize_user(user):
    return {
        'osmId': user.osm_id,
        'username': user.osm_name
    }


def deserialize_user(user_data):
    return User(user_data['osmId'], user_data['username'])


def serialize_node(node):
    return {
        'osmId': node.osm_id,
        'lat': node.lat,
        'lng': node.lng,
        'version': node.version,
        'receiveUpdates': node.receive_updates,
        'name': node.name,
        'noteId': node.osm_note_id,
    }


def deserialize_node(node_data):
    return Node(0, node_data['name'],
                node_data['osmId'], node_data['noteId'],
                node_data['lat'], node_data['lng'],
                node_data['version'], node_data['receiveUpdates'])
