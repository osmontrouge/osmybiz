#!/usr/bin/env python3
import os
import subprocess
from os.path import dirname
from time import sleep

URLS = [
    {
        'url': 'https://osmybiz.sifs0003.infs.ch',
        'osm_key': 'tfPZUUdo2VeGRXMcTXKwvHL98Ai1ecfBILYfFgDR',
        'osm_secret': '6GQh8RkssbXOGb2sPHB2whZkbkBSA7lAiDLfLQzC',
    },
    {
        'url': 'https://osmybiz.osm.ch',
        'osm_key': 'vhlaIQluGzY7AkDuribv6AhwApXXqSRpNmiLAbPM',
        'osm_secret': '8FmLUSZe2SarB35ZGlP6xrb65zf9n01CzBsFreYH',
    }
]
COMPOSE_DIR = os.path.abspath(dirname(__file__))
COMPOSE_FILE = 'docker-compose_build.yml'

environ = os.environ.copy()

def build():
    os.chdir(COMPOSE_DIR)
    for config in URLS:
        _, url_without_prefix = config['url'].split('https://', 1)
        environ['API_URL'] = '{0}/api/'.format(config['url'])
        environ['OSM_URL'] = 'https://www.openstreetmap.org'
        environ['OSM_OAUTH_KEY'] = config['osm_key']
        environ['OSM_OAUTH_SECRET'] = config['osm_secret']
        environ['IMAGE_POSTFIX'] = url_without_prefix
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
