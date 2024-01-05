FROM node:16.15.0 AS staging

COPY ./package.json /srv/frontend/package.json
COPY ./package-lock.json /srv/frontend/package-lock.json

RUN cd /srv/frontend && npm ci

FROM node:16.15.0 AS build

COPY ./ /srv/frontend
COPY --from=staging /srv/frontend/node_modules /srv/frontend/node_modules

WORKDIR /srv/frontend
RUN npm install
CMD ["npm", "run", "serve", "--disable-host-check"]

EXPOSE 8081
