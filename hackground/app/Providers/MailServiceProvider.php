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
            'encryption' => env('MAIL_ENCRYPTION','smtp'),
            'username' => get_setting('smtp-user'),
            'password' => get_setting('smtp-pass'),
            'stream' => [
                'ssl' => [
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                    'allow_self_signed' => true,
                ],
            ],
        ]);
        

        Config::set('mail.from', [
            'address' => get_setting('smtp-user') ?? 'default@example.com',
            'name' => get_setting('smtp-from-name') ?? config('app.name'),
        ]);

    }
}
