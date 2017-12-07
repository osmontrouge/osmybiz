from flask import request, jsonify, abort
from app import create_app
import json
from app.models import User, Node
import sys

app = create_app('postgresql+psycopg2://osmybiz:123456@database:5432/osmybiz')


def is_user_valid(user):
    print('uservali', file=sys.stderr)
    if 'osmId' not in user or not isinstance(user['osmId'], int):
        return False

    print('id valid', file=sys.stderr)

    if 'username' not in user or not isinstance(user['username'], str):
        return False

    return True


def is_node_valid(node):
    print(node, file=sys.stdout)
    if 'osmId' not in node or not isinstance(node['osmId'], int):
        print('osmid invalid', file=sys.stderr)
        return False

    if 'lat' not in node or not isinstance(node['lat'], float):
        print('lat invalid', file=sys.stderr)
        return False

    if 'lng' not in node or not isinstance(node['lng'], float):
        print('lng invalid', file=sys.stderr)
        return False

    if 'version' not in node or not isinstance(node['version'], int):
        print('version invalid', file=sys.stderr)
        return False

    if 'recieveUpdates' not in node or not isinstance(node['recieveUpdates'], bool):
        print('recieveupdates invalid', file=sys.stderr)
        return False

    if 'name' not in node or not isinstance(node['name'], str):
        print('name invalid', file=sys.stderr)
        return False
    return True


def to_user_vm(user):
    return {
        'osmId': user.osmId,
        'username': user.osmName
    }


def to_node_vm(node):
    return {
        'osmId': node.osmId,
        'lat': node.lat,
        'lng': node.lng,
        'version':	node.version,
        'recieveUpdates': node.recieveUpdates,
        'name': node.name
    }


def find_user_by_osmid(osmid):
    return User.query.filter(User.osmId == osmid).first()


def find_node_by_user_and_id (userid, osmid):
    return Node.query.filter(Node.userId == userid, Node.osmId == osmid).first()


def find_nodes_by_user_id (userid):
    return Node.query.filter(Node.userId == userid)


@app.route('/api/')
def hello_world():
    users = User.query.all()
    vms = list(map(lambda u: to_user_vm(u), users))
    return jsonify(vms)


@app.route('/api/test')
def hello_world2():
    nodes = Node.query.all()
    vms = list(map(lambda n: to_node_vm(n), nodes))
    return jsonify(vms)


@app.route('/api/user', methods=['POST'])
def add_or_update_user():
    user = json.loads(request.data)
    if not is_user_valid(user):
        abort(400)

    userEntry = find_user_by_osmid(user['osmId'])

    if userEntry is None:
        userEntry = User(user['osmId'], user['username'])
    else:
        userEntry.osmName = user['username']

    userEntry.save()
    return '', 200


@app.route('/api/user/<int:userid>/node', methods=['POST'])
def add_or_update_node(userid):
    node = json.loads(request.data)
    user = find_user_by_osmid(userid)

    if user is None:
        abort(404)

    if not is_node_valid(node):
        abort(400)

    existingNode = find_node_by_user_and_id(user.id, node['osmId'])

    if existingNode is None:
        existingNode = Node(user.id, node['name'], node['osmId'], node['lat'], node['lng'], node['version'], node['recieveUpdates'])
    else:
        existingNode.lat = node['lat']
        existingNode.lng = node['lng']
        existingNode.version = node['version']
        existingNode.recieveUpdates = node['recieveUpdates']
        existingNode.name = node['name']

    existingNode.save()

    return '', 200


@app.route('/api/user/<int:userid>/node', methods=['GET'])
def fetch_nodes(userid):
    user = find_user_by_osmid(userid)

    if user is None:
        abort(404)

    nodes = find_nodes_by_user_id(user.id)
    vms = list(map(lambda n: to_node_vm(n), nodes))
    return jsonify(vms)


@app.route('/api/user/<int:userid>/node/<int:nodeid>/unsubscribe', methods=['POST'])
def unsubscribe(userid, nodeid):
    user = find_user_by_osmid(userid)

    if user is None:
        abort(404)

    node = find_node_by_user_and_id(user.id, nodeid)

    if node is None:
        abort(404)

    node.recieveUpdates = False
    node.save()

    return '', 200

@app.route('/api/user/<int:userid>/node/<int:nodeid>/delete', methods=['POST'])
def deleteNode(userid, nodeid):
    user = find_user_by_osmid(userid)

    if user is None:
        abort(404)

    node = find_node_by_user_and_id(user.id, nodeid)

    if node is not None:
        node.delete()
        
    return  '', 200

if __name__ == '__main__':
    app.run(port=5000, host="0.0.0.0")
