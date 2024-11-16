# Roundest (Laravel Livewire Version)

## Setup

1. Copy environment file:
   ```bash
   cp .env.example .env
   ```

2. Install dependencies:
   ```bash
   composer install
   npm install
   ```

3. Set up database:
   ```bash
   php artisan migrate --seed
   ```

4. Start the development server:
   ```bash
   composer run dev
   ```

## Deployment

1. Install the Fly.io CLI
2. Launch with ```fly launch``` (yes it's actually that easy)