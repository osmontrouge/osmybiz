from app.db import db


class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    osm_id = db.Column(db.BigInteger)
    osm_name = db.Column(db.String)
    date_created = db.Column(db.DateTime, default=db.func.current_timestamp())
    date_modified = db.Column(
        db.DateTime, default=db.func.current_timestamp(),
        onupdate=db.func.current_timestamp())

    def __init__(self, osm_id, osm_name):
        self.osm_id = osm_id
        self.osm_name = osm_name

    def save(self):
        db.session.add(self)
        db.session.commit()


class Node(db.Model):

    __tablename__ = 'node'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    osm_id = db.Column(db.BigInteger)
    lat = db.Column(db.Float)
    lng = db.Column(db.Float)
    version = db.Column(db.Integer)
    receive_updates = db.Column(db.Boolean)
    name = db.Column(db.String)
    date_created = db.Column(db.DateTime, default=db.func.current_timestamp())
    date_modified = db.Column(
        db.DateTime, default=db.func.current_timestamp(),
        onupdate=db.func.current_timestamp())

    def __init__(self, user_id, name, osm_id, lat, lng,
                 version, receive_updates):
        self.user_id = user_id
        self.osm_id = osm_id
        self.lat = lat
        self.lng = lng
        self.version = version
        self.receive_updates = receive_updates
        self.name = name

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()
