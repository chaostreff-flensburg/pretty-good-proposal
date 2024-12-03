FROM php:8.2-cli-alpine3.18 AS build

RUN mkdir -p /var/www/html
RUN mkdir -p /var/www/html/databasestore

WORKDIR /var/www/html

# Install Composer manually
COPY --from=composer/composer:latest-bin /composer /usr/bin/composer

COPY ./ /var/www/html

RUN ls -al

RUN composer install --optimize-autoloader --no-interaction --no-dev --ignore-platform-req=ext-intl

RUN mkdir -p /var/www/html

ENV TZ=Europe/Berlin

RUN apk add --no-cache \
    icu-dev \
    icu-libs \
    zlib-dev
# Install and enable the intl and gd extensions
RUN docker-php-ext-install intl pdo_mysql

RUN chmod +x /var/www/html/entrypoint.sh

EXPOSE 80
ENTRYPOINT ["sh", "/var/www/html/entrypoint.sh" ]
CMD ["php", "-S", "0.0.0.0:80", "-t", "/var/www/html/public"]
