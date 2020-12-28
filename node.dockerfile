FROM node:lts-alpine As development

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn

COPY . .

RUN yarn build

FROM node:lts-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV PORT 3000

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn global add pm2 && yarn install --production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

EXPOSE ${PORT}

CMD ["pm2-runtime", "start", "dist/main.js", "&"]