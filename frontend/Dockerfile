FROM node:20-alpine AS build
RUN apk add --no-cache libc6-compat
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.33.4 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --ignore-scripts

COPY . .
ARG VITE_API_URL=https://apicandeyinventario.argmstudio.com
ENV VITE_API_URL=$VITE_API_URL
RUN pnpm run build

FROM nginx:alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /app/dist

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]