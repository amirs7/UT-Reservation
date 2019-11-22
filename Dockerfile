FROM node:lts-slim
RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get install -y sqlite3 libsqlite3-dev

COPY ./package.json /home

WORKDIR /home
RUN npm install --loglevel verbose

ENV SERVER_PORT 2000
RUN mkdir db
COPY ./src /home/src
COPY ./scripts /home/scripts
RUN sqlite3 ./db/rooms.db < scripts/init.sql
EXPOSE 2000/tcp
WORKDIR /home/src
ENTRYPOINT ["node", "index.js"]