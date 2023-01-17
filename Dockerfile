FROM node:16-alpine as builder

ENV NODE_ENV build

WORKDIR /app

COPY package*.json ./

COPY --chown=node:node . .

RUN mkdir /app/node_modules
RUN chown -R node:node /app/

USER node

RUN npm ci

RUN npm run build \
    && npm prune --production

# ---

FROM node:16-alpine

ENV NODE_ENV production

USER node
WORKDIR /app

COPY --from=builder --chown=node:node /app/package*.json ./
COPY --from=builder --chown=node:node /app/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /app/dist/ ./dist/

CMD ["node", "dist/main.js"]