from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand
from app import db, create_app
import os


default_url = 'postgresql+psycopg2://osmybiz:123456@database:5432/osmybiz'
db_url = os.environ.get('DB_URL', default_url)

app = create_app(db_url)
migrate = Migrate(app, db)
manager = Manager(app)

manager.add_command('db', MigrateCommand)

if __name__ == '__main__':
    manager.run()
