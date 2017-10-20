from app import db

class Note(db.Model):

    __tablename__ = 'notes'

    id = db.Column(db.Integer, primary_key=True)
    osm_note_id = db.Column(db.Integer)
    osm_state = db.Column(db.String)
    date_created = db.Column(db.DateTime, default=db.func.current_timestamp())
    date_modified = db.Column(
        db.DateTime, default=db.func.current_timestamp(),
        onupdate=db.func.current_timestamp())

    def __init__(self, osm_note_id, osm_state):
        self.osm_note_id = osm_note_id
        self.osm_state = osm_state

    def save(self):
        db.session.add(self)
        db.session.commit()

    @staticmethod
    def get_all():
        return Note.query.all()

    def delete(self):
        db.session.delete(self)
        db.session.commit()