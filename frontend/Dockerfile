FROM node:alpine as builder

WORKDIR /app
ADD . .
# Needs to be set to the backend url
ENV VITE_BACKEND_URL=https://bewerben.c3fl.de/api

RUN npm ci && npm run build

# build nginx webserver
FROM nginx:alpine

EXPOSE 80

ADD ./nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /var/www/html
