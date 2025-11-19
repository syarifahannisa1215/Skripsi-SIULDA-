<?php

namespace App\Notifications;

use App\Models\Ulasan;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NotifikasiUlasan extends Notification
{
    use Queueable;
    public function __construct(
        public Ulasan $ulasan
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }


    public function toArray(object $notifiable): array
    {
        return [
            'user_name' => $this->ulasan->user->name,
            'ulasan_snippet' => \Illuminate\Support\Str::limit($this->ulasan->konten, 50),
            'url' => route('dashboard.ulasan.index'),
        ];
    }
}
