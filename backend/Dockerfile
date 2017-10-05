FROM python:3.6
MAINTAINER Max Luethi, Simon Heller

ENV DOCKERIZE_VERSION v0.5.0
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8
ENV PYTHONIOENCODING=UTF-8
ENV PYTHONUNBUFFERED=non-empty-string

ENV HOME /opt/backend
WORKDIR ${HOME}
COPY api/requirements.txt tmp/requirements.txt
RUN pip install -r tmp/requirements.txt
COPY api/ ${HOME}
ENTRYPOINT ["dockerize", "-wait", "tcp://database:5432"]
CMD ["python", "api.py"]
