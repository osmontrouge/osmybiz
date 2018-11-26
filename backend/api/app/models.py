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
    lat = db.Column(db.Float)
    lng = db.Column(db.Float)
    name = db.Column(db.String)
    osm_id = db.Column(db.BigInteger)
    osm_note_id = db.Column(db.BigInteger)
    osm_type = db.Column(db.String(8))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    receive_updates = db.Column(db.Boolean)
    version = db.Column(db.Integer)

    date_created = db.Column(db.DateTime, default=db.func.current_timestamp())
    date_modified = db.Column(
        db.DateTime, default=db.func.current_timestamp(),
        onupdate=db.func.current_timestamp())

    def __init__(self, user_id, lat, lng, name, osm_id, osm_note_id, osm_type,
                 receive_updates, version):
        self.user_id = user_id
        self.lat = lat
        self.lng = lng
        self.name = name
        self.osm_id = osm_id
        self.osm_note_id = osm_note_id
        self.osm_type = osm_type
        self.receive_updates = receive_updates
        self.version = version

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()
