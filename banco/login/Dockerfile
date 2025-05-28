FROM node:18-alpine

WORKDIR /app

RUN npm install -g pnpm @angular/cli

COPY package.json ./

RUN grep -v '"common-utils"' package.json > package.temp.json && \
    mv package.temp.json package.json

RUN pnpm install

COPY . .

EXPOSE 3003

CMD ["pnpm", "run", "start:docker"]


