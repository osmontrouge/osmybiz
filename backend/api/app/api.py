from flask import Blueprint, request, jsonify
import json
from app.business import add_or_update_user, add_or_update_business_poi, get_business_pois_for_user, \
    unsub_user_from_business_poi, delete_business_poi, get_temporary_osm_id_for_user


api = Blueprint('api', __name__, url_prefix='/api')


@api.route('/user', methods=['POST'])
def update_user():
    user_data = json.loads(request.data)
    return add_or_update_user(user_data)


@api.route('/user/<int:userid>/business-poi', methods=['POST'])
def update_business_poi(userid):
    business_poi = json.loads(request.data)
    return add_or_update_business_poi(userid, business_poi)


@api.route('/user/<int:userid>/business-poi', methods=['GET'])
def fetch_business_pois(userid):
    data = get_business_pois_for_user(userid)
    return jsonify(data)


@api.route('/user/<int:userid>/business-poi/<int:osmid>/unsubscribe',
           methods=['POST'])
def unsubscribe(userid, osmid):
    return unsub_user_from_business_poi(userid, osmid)


@api.route('/user/<int:userid>/business-poi/<signed_int:osmid>/delete', methods=['POST'])
def delete(userid, osmid):
    return delete_business_poi(userid, osmid)


@api.route('/user/<int:userid>/temporary-osm-id', methods=['GET'])
def fetch_noteId(userid):
    temporaryOsmId = get_temporary_osm_id_for_user(userid)
    return jsonify(temporaryOsmId)
