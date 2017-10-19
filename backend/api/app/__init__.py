# app/__init__.py

from flask_sqlalchemy import SQLAlchemy
from flask import Flask

# initialize sql-alchemy
db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://osm-my-biz:123456@database:5432/osm-my-biz'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)

    return app