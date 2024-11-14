FROM node:20-alpine as base
MAINTAINER Jason

WORKDIR /www

RUN npm config set registry https://registry.npmmirror.com/
RUN npm get registry
RUN npm install -g pnpm
RUN pnpm config set registry https://registry.npmmirror.com/
RUN npm install -g pm2

# install && build
FROM base as build
COPY . /www
RUN pnpm install && pnpm build:game

# run
FROM base
COPY . /www
COPY --from=build /www/node_modules /www/node_modules
COPY --from=build /www/packages/backend/node_modules /www/packages/backend/node_modules
COPY --from=build /www/packages/core/node_modules /www/packages/core/node_modules
COPY --from=build /www/packages/db/node_modules /www/packages/db/node_modules
COPY --from=build /www/packages/game/node_modules /www/packages/game/node_modules
COPY --from=build /www/packages/game/dist /www/packages/backend/src/static

EXPOSE 7788
WORKDIR /www
VOLUME /www
CMD ["pm2","--no-daemon","start","pnpm","--name","star-angry","--","run","dev:backend"]
