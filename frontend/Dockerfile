# Stage 1
FROM node:16.15-slim AS build-frontend

WORKDIR /usr/local/ap-roove

COPY ./ /usr/local/ap-roove/

RUN npm install && npm run build --prod

# Stage 2
FROM nginx:alpine

COPY --from=build-frontend /usr/local/ap-roove/dist /usr/share/nginx/html

EXPOSE 80