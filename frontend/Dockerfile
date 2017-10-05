FROM node:8

ENV HOME /opt/frontend

WORKDIR ${HOME}
COPY ./osmmybiz/package.json ${HOME}/package.json
COPY ./osmmybiz/package-lock.json ${HOME}/package-lock.json
RUN npm install

COPY ./osmmybiz ${HOME}

WORKDIR ${HOME}
CMD ["npm", "run", "dev"]
