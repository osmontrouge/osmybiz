from app.db import db

INITIAL_TEMPORARY_OSM_ID = -1


class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    osm_id = db.Column(db.BigInteger)
    temporary_osm_id = db.Column(db.BigInteger, nullable=False)
    osm_name = db.Column(db.String)
    date_created = db.Column(db.DateTime, default=db.func.current_timestamp())
    date_modified = db.Column(
        db.DateTime, default=db.func.current_timestamp(),
        onupdate=db.func.current_timestamp())

    def __init__(self, osm_id, osm_name):
        self.osm_id = osm_id
        self.osm_name = osm_name
        self.temporary_osm_id = INITIAL_TEMPORARY_OSM_ID

    def save(self):
        db.session.add(self)
        db.session.commit()


class BusinessPOI(db.Model):
    __tablename__ = 'business_poi'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    osm_id = db.Column(db.BigInteger)
    osm_note_id = db.Column(db.BigInteger)
    osm_type = db.Column(db.String(8))
    lat = db.Column(db.Float)
    lng = db.Column(db.Float)
    version = db.Column(db.Integer)
    receive_updates = db.Column(db.Boolean)
    name = db.Column(db.String)
    date_created = db.Column(db.DateTime, default=db.func.current_timestamp())
    date_modified = db.Column(
        db.DateTime, default=db.func.current_timestamp(),
        onupdate=db.func.current_timestamp())

    def __init__(self, user_id, name, osm_id, osm_type, osm_note_id, lat, lng,
                 version, receive_updates):
        self.user_id = user_id
        self.osm_id = osm_id
        self.osm_note_id = osm_note_id
        self.osm_type = osm_type
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
