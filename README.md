# SNS Buzz Maker

AI-powered SNS post generation app built with Laravel, React, Stripe, and Gemini.

## Features

- User registration and login
- SNS post generation
- Free plan daily generation limit
- Premium templates and improvement actions
- Stripe checkout integration
- Contact form with email notification
- Admin inquiry dashboard
- Legal, privacy, pricing, guide, and sample pages

## Setup

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate
npm run build
php artisan serve
```

Configure required environment variables in `.env` before production deployment.
