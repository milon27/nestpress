FROM node:22.15.0-alpine AS build
RUN npm install -g pnpm@11.5.2

WORKDIR /app

COPY package.json .
COPY pnpm-lock.yaml .
COPY pnpm-workspace.yaml .

RUN pnpm install --frozen-lockfile

COPY . .

RUN npm run build

# # ------------------dev -------------------

FROM node:22.15.0-alpine AS dev
RUN npm install -g pnpm@11.5.2

WORKDIR /app

# (set in docker compose file)
COPY --from=build /app/.env.dev ./.env
COPY --from=build /app/package.json .
COPY --from=build /app/pnpm-lock.yaml .
COPY --from=build /app/resources ./resources
COPY --from=build /app/public ./public
COPY --from=build /app/node_modules/ ./node_modules/
COPY --from=build /app/dist/ ./dist/

# migrate db to production(dev)
# seed the db (plan list)
# run the app

# Run compiled JS directly (no pnpm at runtime — avoids the deps-status-check
# that triggers a slow supply-chain network call and ignored-build errors on boot)
CMD ["/bin/sh", "-c", "node dist/src/config/db/utils/migrator.js && node dist/src/config/db/utils/seed.js && node dist/src/server.js"]

# # ------------------prod -------------------

FROM node:22.15.0-alpine AS prod
RUN npm install -g pnpm@11.5.2

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

# Run compiled JS directly (no pnpm at runtime — avoids the deps-status-check
# that triggers a slow supply-chain network call and ignored-build errors on boot)
CMD ["/bin/sh", "-c", "node dist/src/config/db/utils/migrator.js && node dist/src/config/db/utils/seed.js && node dist/src/server.js"]
