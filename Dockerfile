### STAGE 1: Build ###
# We label our stage as ‘builder’
FROM node:10-jessie as builder

ARG app

RUN apt update && apt upgrade -y
RUN apt install -y autoconf \
                automake \
                g++ \
                libc6 \
                libjpeg-dev \
                libpng-dev \
                make \
                nasm \
                m4 \
                perl

RUN mkdir /ng-app
WORKDIR /ng-app
COPY . .
RUN rm -rf ./node_modules
#RUN rm -rf ./package-lock.json
RUN npm install
RUN npm install -g bower
RUN npm install -g grunt-cli
RUN bower install --allow-root

RUN grunt build

#COPY ./default.cfg /ng-app/dist/

### STAGE 2: Setup ###

FROM nginx:1.13.3-alpine

COPY ./entrypoint.sh /
RUN chmod +x /entrypoint.sh

## Copy our default nginx config
COPY nginx/frontend.nginx /etc/nginx/conf.d/default.conf

## Remove default nginx website
RUN rm -rf  /service/dist/*

## From ‘builder’ stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder /ng-app/dist  /service/dist


ENTRYPOINT [ "/entrypoint.sh" ]
