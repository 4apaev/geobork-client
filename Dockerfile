FROM node:latest

RUN mkdir -p /usr/geobork-client
WORKDIR /usr/geobork-client

COPY package.json /usr/geobork-client

RUN npm install

COPY . /usr/geobork-client

# ENV PATH /usr/geobork/node_modules/.bin:$PATH
ENV PORT 3001
EXPOSE $PORT

CMD ["npm", "start"]
