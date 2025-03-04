FROM node:20.18.0-alpine AS build
RUN npm install -g pnpm

WORKDIR /app

COPY package.json .
COPY pnpm-lock.yaml .

RUN pnpm install

COPY . .

RUN npm run build

# # ------------------dev -------------------

FROM node:20.18.0-alpine AS dev
RUN npm install -g pnpm

WORKDIR /app

# (set in docker compose file)
COPY --from=build /app/.env ./.env
COPY --from=build /app/package.json .
COPY --from=build /app/pnpm-lock.yaml .
COPY --from=build /app/resources ./resources
COPY --from=build /app/public ./public
COPY --from=build /app/node_modules/ ./node_modules/
COPY --from=build /app/dist/ ./dist/

# migrate db to production(dev)
# seed the db (plan list)
# run the app

CMD ["/bin/sh", "-c", "pnpm db:migrate:prod && pnpm db:seed:prod && node dist/src/server.js"]

# # ------------------prod -------------------

FROM node:20.18.0-alpine AS prod
RUN npm install -g pnpm

WORKDIR /app

# (set in docker compose file)
COPY --from=build /app/.env.prod ./.env
COPY --from=build /app/package.json .
COPY --from=build /app/pnpm-lock.yaml .
COPY --from=build /app/resources ./resources
COPY --from=build /app/public ./public
COPY --from=build /app/node_modules/ ./node_modules/
COPY --from=build /app/dist/ ./dist/

# migrate db to production(dev)
# seed the db (plan list)
# run the app

CMD ["/bin/sh", "-c", "pnpm db:migrate:prod && pnpm db:seed:prod && node dist/src/server.js"]