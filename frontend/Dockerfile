FROM node:8

ENV HOME /opt/frontend

WORKDIR ${HOME}
COPY ./osmybiz/package.json ${HOME}/package.json
COPY ./osmybiz/package-lock.json ${HOME}/package-lock.json
RUN npm install

COPY ./osmybiz ${HOME}

WORKDIR ${HOME}
CMD ["npm", "run", "dev"]
