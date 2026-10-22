#!/bin/sh

cd /var/www/html

# The storage volume may still contain root-owned files from older images
mkdir -p storage/framework/sessions storage/framework/views storage/framework/cache storage/logs
chown -R www-data:www-data storage bootstrap/cache databasestore

run() { su-exec www-data "$@"; }

php artisan storage:link
run php artisan optimize:clear
run php artisan config:cache
run php artisan route:cache
run php artisan view:cache
run php artisan event:cache

# Wait until db is online
sleep 1
run php artisan migrate --force

exec su-exec www-data "$@"
