FROM php:8.5-cli-alpine3.24

ENV TZ=Europe/Berlin

WORKDIR /var/www/html

# Pull in Alpine security fixes released after the base image was built
RUN apk upgrade --no-cache

# Install the intl and pdo_mysql extensions; build-only packages are removed afterwards
RUN apk add --no-cache icu-libs su-exec \
    && apk add --no-cache --virtual .build-deps icu-dev \
    && docker-php-ext-install intl pdo_mysql \
    && apk del .build-deps

# Hardened defaults: no display_errors, no X-Powered-By header
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini" \
    && echo "expose_php = Off" > "$PHP_INI_DIR/conf.d/security.ini"

COPY --from=composer/composer:2-bin /composer /usr/bin/composer

# Install dependencies first so this layer is cached until composer.lock changes
COPY composer.json composer.lock ./
RUN composer install --no-interaction --no-dev --no-scripts --no-autoloader --prefer-dist

COPY . .
RUN composer dump-autoload --no-interaction --no-dev --optimize \
    && mkdir -p databasestore \
    && chown -R www-data:www-data storage bootstrap/cache databasestore

EXPOSE 80
ENTRYPOINT ["sh", "/var/www/html/entrypoint.sh"]
CMD ["php", "-S", "0.0.0.0:80", "-t", "/var/www/html/public"]
