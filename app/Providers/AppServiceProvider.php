<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Email de vérification en français, avec un objet clair
        VerifyEmail::toMailUsing(function (object $notifiable, string $url) {
            return (new MailMessage)
                ->subject('Confirmez votre adresse email - Oracle de Prix')
                ->greeting('Bonjour ' . ($notifiable->prenom ?? '') . ',')
                ->line('Merci de vous être inscrit sur Oracle de Prix, la plateforme de prix agricoles.')
                ->line('Cliquez sur le bouton ci-dessous pour confirmer votre adresse email et activer votre compte.')
                ->action('Confirmer mon email', $url)
                ->line('Ce lien est valable 60 minutes. Si vous n\'êtes pas à l\'origine de cette inscription, ignorez simplement ce message.')
                ->salutation('L\'équipe Oracle de Prix');
        });
    }
}
