FROM node:14.5 AS staging

COPY ./package.json /srv/backend/package.json
COPY ./package-lock.json /srv/backend/package-lock.json

RUN cd /srv/backend && npm ci

FROM node:14.5 AS build

COPY ./ /srv/backend
COPY --from=staging /srv/backend/node_modules /srv/backend/node_modules

WORKDIR /srv/backend
RUN rm -f database/*
RUN node migrate.js
CMD ["node", "server.js"]

EXPOSE 3128 5000
