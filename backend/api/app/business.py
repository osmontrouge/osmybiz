from app.models import User, Node
from flask import abort
from app.validation import is_user_valid, is_node_valid
from app.serialization import serialize_node, serialize_user,\
    deserialize_node, deserialize_user


def find_user_by_osmid(osmid):
    return User.query.filter(User.osm_id == osmid).first()


def find_node_by_user_and_id(userid, osmid):
    return Node.query.filter(Node.user_id == userid,
                             Node.osm_id == osmid).first()


def find_nodes_by_user_id(userid):
    return Node.query.filter(Node.user_id == userid)


def get_all_users():
    users = User.query.all()
    return list(map(lambda u: serialize_user(u), users))


def get_all_nodes():
    nodes = Node.query.all()
    return list(map(lambda n: serialize_node(n), nodes))


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


def add_or_update_node(user_id, node_data):

    user = ensure_user(user_id)

    if not is_node_valid(node_data):
        abort(400)

    node = deserialize_node(node_data)

    existing_node = find_node_by_user_and_id(user.id, node.osm_id)

    if existing_node is None:
        existing_node = node
        existing_node.user_id = user.id
    else:
        existing_node.lat = node.lat
        existing_node.lng = node.lng
        existing_node.version = node.version
        existing_node.receive_updates = node.receive_updates
        existing_node.name = node.name

    existing_node.save()

    return '', 200


def get_nodes_for_user(user_id):
    user = ensure_user(user_id)

    nodes = find_nodes_by_user_id(user.id)
    return list(map(lambda n: serialize_node(n), nodes))


def load_node(user_id, node_id):
    user = ensure_user(user_id)

    return find_node_by_user_and_id(user.id, node_id)


def unsub_user_from_node(user_id, node_id):
    node = load_node(user_id, node_id)

    if node is None:
        abort(404)

    node.recieveUpdates = False
    node.save()

    return '', 200


def delete_node(user_id, node_id):

    node = load_node(user_id, node_id)

    if node is not None:
        node.delete()

    return '', 200
