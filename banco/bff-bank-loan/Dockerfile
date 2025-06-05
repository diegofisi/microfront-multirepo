FROM node:18-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json ./

RUN pnpm install --prod

COPY . .

EXPOSE 4001

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet \
  --method=POST \
  --body-data='{"amount":1000,"months":12,"annualRate":5}' \
  --header='Content-Type: application/json' \
  --server-response \
  http://localhost:4001/api/loan \
  -O - \
  || exit 1

CMD ["pnpm", "start"]
