from flask import Blueprint, request, jsonify
import json
from app.business import get_all_users, get_all_nodes, \
    add_or_update_user, add_or_update_node, get_nodes_for_user, \
    unsub_user_from_node, delete_node, get_note_without_node_id_for_user


api = Blueprint('api', __name__, url_prefix='/api')


@api.route('/')
def hello_world():
    data = get_all_users()
    return jsonify(data)


@api.route('/test')
def hello_world2():
    data = get_all_nodes()
    return jsonify(data)


@api.route('/user', methods=['POST'])
def update_user():
    user_data = json.loads(request.data)

    return add_or_update_user(user_data)


@api.route('/user/<int:userid>/node', methods=['POST'])
def update_node(userid):
    node = json.loads(request.data)
    return add_or_update_node(userid, node)


@api.route('/user/<int:userid>/node', methods=['GET'])
def fetch_nodes(userid):
    data = get_nodes_for_user(userid)
    return jsonify(data)


@api.route('/user/<int:userid>/node/<int:nodeid>/unsubscribe',
           methods=['POST'])
def unsubscribe(userid, nodeid):
    return unsub_user_from_node(userid, nodeid)


@api.route('/user/<int:userid>/node/<int:nodeid>/delete', methods=['POST'])
def delete(userid, nodeid):
    return delete_node(userid, nodeid)

@api.route('/user/<int:userid>/noteWithoutNodeId', methods=['GET'])
def fetch_noteId(userid):
    noteWithoutNodeId = get_note_without_node_id_for_user(userid)
    return jsonify(noteWithoutNodeId)

