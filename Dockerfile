FROM node:lts-slim
RUN sudo apt-get -y update
RUN sudo apt-get -y upgrade
RUN sudo apt-get install -y sqlite3 libsqlite3-dev

COPY ./package.json /home

WORKDIR /home
RUN npm install --loglevel verbose

ENV SERVER_PORT 2000
COPY ./src /home/src
EXPOSE 2000/tcp
WORKDIR /home/src
ENTRYPOINT ["node", "index.js"]