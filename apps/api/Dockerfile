FROM node:20-alpine
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm db:generate
RUN pnpm build
EXPOSE 3001
CMD ["sh", "-c", "pnpm db:migrate:deploy && node dist/index.js"]
