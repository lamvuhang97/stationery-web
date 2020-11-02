FROM node:10.21.0-alpine

# create destination directory
RUN mkdir -p /usr/src/vms-app
WORKDIR /usr/src/vms-app

# update and install dependency
RUN apk update && apk upgrade
RUN apk add git

# copy the app, note .dockerignore
COPY . /usr/src/vms-app/
COPY .env.staging /usr/src/vms-app/.env
RUN npm install

# build necessary, even if no static files are needed,
# since it builds the server as well
RUN npm run build

# expose 1313 on container
EXPOSE 3004

CMD  npm run serve