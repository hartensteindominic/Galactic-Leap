FROM node:22-alpine

WORKDIR /app

COPY package.json ./

ENV NODE_ENV=production
ENV PORT=3000

COPY server.js ./

EXPOSE 3000

CMD ["npm", "start"]
