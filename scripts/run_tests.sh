#!/bin/bash
set -e

COMPOSE_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
cd ${COMPOSE_DIR}
export COMPOSE_PROJECT_NAME=test_osmybiz
docker-compose down -v --remove-orphans -t 0
docker-compose build api frontend
echo
echo "##################################"
echo "running flake8 on code base. Issues will show up if any."
docker-compose run --entrypoint='' --rm api flake8
echo "-----------------------------------"
docker-compose run --entrypoint='' --rm api pytest
echo "-----------------------------------"
docker-compose run --entrypoint='' --rm frontend npm run lint
echo "-----------------------------------"
docker-compose run --entrypoint='' --rm frontend npm run unit
echo "##################################"
echo
docker-compose down -v --remove-orphans -t 0
