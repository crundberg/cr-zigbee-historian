FROM node:18-alpine 

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied where available (npm@5+)
COPY package*.json ./

# RUN npm install
# If you are building your code for production
RUN npm install --omit=dev

# Bundle app source
COPY ./src ./

# Enviroment variables
ENV NODE_ENV=production

ENV conbeeHost=host
ENV conbeeToken=token

ENV hueHost=host
ENV hueToken=token

ENV influxUrl=localhost
ENV influxToken=token
ENV influxOrg=organization
ENV influxBucket=bucket

ENV logLevel=info

CMD [ "node", "index.js" ]