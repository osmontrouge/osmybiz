Backend
=======

Run `python run.py` in order to launch the backend locally (needs local db).

If the database model changed, run `pyhton manage.py db migrate` to create a db migration.
Then run `python manage.py db upgrade` in order to apply the migration to the database.
If you need to migrate a database within the docker container run `docker-compose run api bash`
and then the same commands as above.