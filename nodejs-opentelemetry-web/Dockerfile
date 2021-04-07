# Use starter image
FROM node:12-alpine

# Create app directory
WORKDIR /webCode/

# Install app dependencies
COPY package.json .
RUN npm install

WORKDIR /usr/src/app

COPY . /usr/src/app/
RUN cp -a /webCode/node_modules /usr/src/app/

EXPOSE 8090

CMD npm run start