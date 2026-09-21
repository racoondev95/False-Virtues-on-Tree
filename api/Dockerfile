FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY frontend/package.json ./frontend/
COPY api/package.json ./api/
RUN npm ci
COPY api ./api
RUN npm run build -w kabbalah-api

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
COPY frontend/package.json ./frontend/
COPY api/package.json ./api/
RUN npm ci --omit=dev -w kabbalah-api
COPY --from=build /app/api/dist ./api/dist
WORKDIR /app/api
EXPOSE 4000
CMD ["node", "dist/index.js"]
