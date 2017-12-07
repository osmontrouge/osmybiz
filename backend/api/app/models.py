from app import db

class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    osmId = db.Column(db.BigInteger)
    osmName = db.Column(db.String)
    date_created = db.Column(db.DateTime, default=db.func.current_timestamp())
    date_modified = db.Column(
        db.DateTime, default=db.func.current_timestamp(),
        onupdate=db.func.current_timestamp())

    def __init__(self, osmId, osmName):
        self.osmId = osmId
        self.osmName = osmName

    def save(self):
        db.session.add(self)
        db.session.commit()

class Node(db.Model):

    __tablename__ = 'node'

    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey('user.id'))
    osmId = db.Column(db.BigInteger)
    lat = db.Column(db.Float)
    lng = db.Column(db.Float)
    version = db.Column(db.Integer)
    recieveUpdates = db.Column(db.Boolean)
    name = db.Column(db.String)
    date_created = db.Column(db.DateTime, default=db.func.current_timestamp())
    date_modified = db.Column(
        db.DateTime, default=db.func.current_timestamp(),
        onupdate=db.func.current_timestamp())

    def __init__(self, userId, name, osmId, lat, lng, version, recieveUpdates):
        self.userId = userId
        self.osmId = osmId
        self.lat = lat
        self.lng = lng
        self.version = version
        self.recieveUpdates = recieveUpdates
        self.name = name

    def save(self):
        db.session.add(self)
        db.session.commit()