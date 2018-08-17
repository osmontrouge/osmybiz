from app import create_app
import os

default_url = 'postgresql+psycopg2://osmybiz:123456@database:5432/osmybiz'
db_url = os.environ.get('DB_URL', default_url)

app = create_app(db_url)

SENTRY_DSN = os.environ.get('SENTRY_DSN')

if SENTRY_DSN:
    from raven.contrib.flask import Sentry
    sentry = Sentry(app, dsn=SENTRY_DSN)

if __name__ == '__main__':
    app.run(port=5000, host="0.0.0.0")
