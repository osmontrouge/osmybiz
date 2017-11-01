from flask import Flask
from app import create_app

app = create_app('postgresql+psycopg2://osm-my-biz:123456@database:5432/osm-my-biz')

@app.route('/api/')
def hello_world():
    return 'Hello World!'


if __name__ == '__main__':
    app.run(port=5000, host="0.0.0.0")
