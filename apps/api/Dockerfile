FROM node:20-alpine
WORKDIR /app
RUN npm install -g pnpm
COPY package.json ./
RUN pnpm install
COPY . .
RUN pnpm db:generate
RUN pnpm build
EXPOSE 3001
CMD ["sh", "-c", "pnpm db:migrate:deploy && node dist/index.js"]
