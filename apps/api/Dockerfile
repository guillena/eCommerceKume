FROM node:20-alpine
RUN apk add --no-cache openssl libc6-compat
WORKDIR /app
RUN npm install -g pnpm
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json .npmrc ./
COPY apps/api/package.json ./apps/api/package.json
RUN pnpm install --frozen-lockfile --filter api...
COPY apps/api ./apps/api
WORKDIR /app/apps/api
RUN pnpm db:generate
RUN pnpm build
EXPOSE 3001
CMD ["sh", "-c", "pnpm exec prisma db push && node dist/index.js"]