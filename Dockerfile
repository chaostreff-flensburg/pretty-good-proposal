FROM node:alpine as builder

WORKDIR /app
ADD . .

ARG SUPABASE_URL
ARG SUPABASE_ANON_KEY

ENV VITE_SUPABASE_URL=$SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY

RUN npm ci && npm run build

# build nginx webserver
FROM nginx:alpine

EXPOSE 80

ADD ./nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /var/www/html
