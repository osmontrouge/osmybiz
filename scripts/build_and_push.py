#!/usr/bin/env python3
import os
import subprocess
from os.path import dirname
from time import sleep

environ = os.environ.copy()

URLS = {
    'staging': {
        'url': 'https://osmybiz.sifs0003.infs.ch',
        'osm_key': environ.get('osmybiz_sifs0003_infs_ch_osm_key'),
        'osm_secret': environ.get('osmybiz_sifs0003_infs_ch_osm_secret'),
        'OSM_URL': 'https://master.apis.dev.openstreetmap.org',
    },
    'production': {
        'url': 'https://osmybiz.osm.ch',
        'osm_key': environ.get('osmybiz_osm_ch_osm_key'),
        'osm_secret': environ.get('osmybiz_osm_ch_osm_secret'),
        'OSM_URL': 'https://www.openstreetmap.org',
    },
}

COMPOSE_DIR = os.path.abspath(dirname(__file__))
COMPOSE_FILE = 'docker-compose_build.yml'
BUILD_VERSION = environ.get('BUILD_VERSION', 'latest')


def build():
    os.chdir(COMPOSE_DIR)
    variant = environ.get('BUILD_VERSION', 'staging')
    config = URLS[variant]
    _, url_without_prefix = config['url'].split('https://', 1)
    environ['API_URL'] = '{0}/api/'.format(config['url'])
    environ['OSM_URL'] = config['OSM_URL']
    environ['OSM_OAUTH_KEY'] = config['osm_key']
    environ['OSM_OAUTH_SECRET'] = config['osm_secret']
    environ['IMAGE_POSTFIX'] = '{}'.format(url_without_prefix, variant)
    environ['COMPOSE_PROJECT_NAME'] = url_without_prefix
    commands = [
        [
            'docker-compose', '-f', os.path.join(COMPOSE_DIR, COMPOSE_FILE), 'build', '--pull', 'frontend',
        ],
        [
            'docker-compose', '-f', os.path.join(COMPOSE_DIR, COMPOSE_FILE), 'run', '--rm', 'frontend', 'bash', '-c', 'cd /opt/frontend && npm run build -p',
        ],
        [
            'docker-compose', '-f', os.path.join(COMPOSE_DIR, COMPOSE_FILE), 'build', '--pull', 'api', 'frontend-build', 'nginx',
        ],
        [
            'docker-compose', '-f', os.path.join(COMPOSE_DIR, COMPOSE_FILE), 'push', 'api', 'frontend-build', 'nginx',
        ],
        [
            'docker-compose', '-f', os.path.join(COMPOSE_DIR, COMPOSE_FILE), 'run', '--rm', 'cleanup',
        ],
    ]
    print(30 * '#')
    print('building {0}'.format(url_without_prefix))
    for command in commands:
        print('executing: ', ' '.join(command))
        sleep(1)
        subprocess.run(command, env=environ, check=True)
    print('built {0}'.format(url_without_prefix))
    sleep(1)
    print(3 * '\n')


if __name__ == '__main__':
    build()
