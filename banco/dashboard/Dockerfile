FROM node:18-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json ./

RUN grep -v '"common-components-react"' package.json | grep -v '"common-utils"' > package.temp.json && \
    mv package.temp.json package.json

RUN pnpm install && pnpm add rxjs

COPY . .

EXPOSE 3000

CMD ["pnpm","run","start:docker"]
