from flask import Flask
from app.db import db
from app.api import api


def create_app(dbConnection):
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = dbConnection
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)

    app.register_blueprint(api)

    return app
