FROM dunglas/frankenphp


RUN install-php-extensions \
    pcntl \
    intl\
    zip


COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

RUN apt-get update && apt-get install -y \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

COPY . /app

RUN composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev

RUN npm install && npm run build

RUN mv .env.example .env

RUN php artisan optimize

RUN touch database/database.sqlite

RUN php artisan migrate:fresh --seed --force

ENTRYPOINT php artisan octane:start --server=frankenphp
