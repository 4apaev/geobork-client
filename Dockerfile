FROM node:latest

RUN mkdir -p /usr/geobork-client
WORKDIR /usr/geobork-client
COPY . /usr/geobork-client
ENV PORT 3001
EXPOSE $PORT

CMD ["npm", "start"]
