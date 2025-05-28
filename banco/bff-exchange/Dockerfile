FROM node:18-alpine

# Set the working directory
WORKDIR /app

RUN npm install -g pnpm

COPY package.json ./

RUN pnpm install --prod

COPY . .

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/api/convert?from=USD&to=EUR&amount=1', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

CMD ["pnpm", "start"]
