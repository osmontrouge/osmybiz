from app import create_app
import pytest

@pytest.fixture
def app():
    app = create_app('sqlite+pysqlite:///tmp/db.db')

    return app

def testbasic