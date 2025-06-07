# loan/Dockerfile

FROM node:18-alpine

WORKDIR /app

# 1. Instala pnpm globalmente
RUN npm install -g pnpm

# 2. Copia únicamente el package.json
COPY package.json ./

# 3. Elimina la línea de common-utils (dejamos intacto cualquier otro "file:")
RUN grep -v '"common-utils"' package.json > package.tmp.json \
  && mv package.tmp.json package.json

# 4. Instala dependencias (se generará un lockfile limpio aquí)
RUN pnpm install

# 5. Copia el resto de la aplicación
COPY . .

# 6. Expone el puerto donde Rspack sirve el remoteEntry
EXPOSE 3004

# 7. Arranca con tu script Docker (que usa el config CommonJS)
CMD ["pnpm", "run", "start:docker"]
