<?php

namespace App\Observers;

use App\Models\Ulasan;
use App\Models\User;
use App\Notifications\NotifikasiUlasan;
use Illuminate\Support\Facades\Notification;

class UlasanObserver
{
    public function created(Ulasan $ulasan): void
    {
        $admins = User::where('role', 'admin')->get();

        Notification::send($admins, new NotifikasiUlasan($ulasan));
    }
}
