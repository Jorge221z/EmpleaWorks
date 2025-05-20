<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail as BaseVerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;

class VerifyEmail extends BaseVerifyEmail
{
    public function toMail($notifiable)
    {
        return parent::toMail($notifiable)
            ->subject(__('messages.verify_email_subject'));
    }
}
