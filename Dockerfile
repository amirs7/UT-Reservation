FROM node:lts-slim
RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get install -y sqlite3 libsqlite3-dev

COPY ./package.json /home

WORKDIR /home
RUN npm install --loglevel verbose

RUN mkdir db
COPY ./src /home/src
COPY ./scripts /home/scripts
RUN sqlite3 ./db/rooms.db < scripts/init.sql
WORKDIR /home/src
ENV SERVER_PORT 8000
EXPOSE 8000/tcp
ENTRYPOINT ["node", 'index.js']