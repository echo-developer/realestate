<?php

namespace App\Providers;

use Illuminate\Support\Facades\Config;
use Illuminate\Support\ServiceProvider;

class MailServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        Config::set('mail.mailers.smtp', [
            'transport' => 'smtp',
            'host' => get_setting('smtp-host'),
            'port' => get_setting('smtp-port'),
            'encryption' => get_setting('smtp-encryption') ?? 'tls',
            'username' => get_setting('smtp-user'),
            'password' => get_setting('smtp-pass'),
        ]);

        Config::set('mail.from', [
            'address' => get_setting('smtp-user') ?? 'default@example.com',
            'name' => get_setting('smtp-from-name') ?? config('app.name'),
        ]);

    }
}
