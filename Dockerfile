# Build stage: the host Node version is irrelevant; Docker uses Node 20.
FROM node:20-bookworm-slim AS build
WORKDIR /app

RUN npm install -g pnpm@10.4.1
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN ./node_modules/.bin/ng build --configuration production

# Runtime stage: serve the compiled Angular SPA with Nginx.
FROM nginx:1.27-alpine AS runtime
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/art-gallery-admin-angular/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
