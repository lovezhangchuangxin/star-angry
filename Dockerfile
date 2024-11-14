FROM node:20-alpine as base
MAINTAINER Jason

VOLUME /www
WORKDIR /www

RUN npm config set registry https://registry.npmmirror.com/
RUN npm get registry
RUN npm install -g pnpm
RUN pnpm config set registry https://registry.npmmirror.com/
RUN npm install -g pm2

FROM base as build
COPY . /www
RUN pnpm install && pnpm build:game
RUN cp /www/packages/game/dist /www/packages/backend/src/static

FROM build
EXPOSE 7788
CMD ["pm2","--no-daemon","start","pnpm","--name","star-angry","--","run","dev:backend"]
