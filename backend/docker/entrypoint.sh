#!/bin/bash

ls -al

mkdir -p storage/framework/{sessions,views,cache}
php artisan storage:link
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
# Wait until db is online
echo "Wait for DB to be ready"
while ! nc -z database 3306; do
    sleep 0.5
    echo "Wait 0.5 seconds"
done
echo "DB is ready"
sleep 1
php artisan migrate --force

exec "$@"
