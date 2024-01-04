FROM php:8.2-cli-alpine3.18 AS build

RUN mkdir -p /var/www/html
RUN mkdir -p /var/www/html/databasestore

WORKDIR /var/www/html

COPY --from=composer/composer:latest-bin /composer /usr/bin/composer

COPY ./ /var/www/html

RUN composer install --optimize-autoloader --no-interaction --no-dev --ignore-platform-req=ext-intl

FROM dunglas/frankenphp

RUN mkdir -p /var/www/html

WORKDIR /app/public

COPY --from=build /var/www/html /app/public

ENV TZ=Europe/Berlin

RUN apt-get update && \
    apt-get install -y netcat-traditional && \
    rm -rf /var/lib/apt/lists/*

RUN install-php-extensions \
    pdo_mysql \
    gd \
    intl \
    zip \
    opcache

RUN chmod +x /app/public/docker/entrypoint.sh

ENTRYPOINT ["/app/public/docker/entrypoint.sh"]
CMD [ "frankenphp", "run", "--config", "/etc/caddy/Caddyfile" ]
