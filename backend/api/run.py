from flask import request, jsonify
from app import create_app
import json

app = create_app('postgresql+psycopg2://osm-my-biz:123456@database:5432/osm-my-biz')

@app.route('/api/')
def hello_world():
    return 'Hello World!'

@app.route('/api/user', methods=['POST'])
def addOrUpdateUser():
    user = json.loads(request.data)
    return jsonify(user)

@app.route('/api/user/<int:userId>/node', methods=['POST'])
def addOrUpdateNode(userId):
    node = json.loads(request.data)
    node['userId'] = userId
    return jsonify(node)

@app.route('/api/user/<int:userId>/node', methods=['GET'])
def fetchNodes(userId):
    return jsonify([1,2,3])

@app.route('/api/user/<int:userId>/node/<int:nodeId>/unsubscribe', methods=['POST'])
def unsubscribe(userId, nodeId):
    return jsonify({'a': userId,'b': nodeId})



if __name__ == '__main__':
    app.run(port=5000, host="0.0.0.0")
