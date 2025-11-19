<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Ulasan extends Model
{
    use HasFactory;
    protected $table = "ulasan";
    protected $fillable = [
        'user_id',
        'target_ulasan_id',
        'konten',
        'rating',
        'visibilitas',
        'sentimen_prediksi',
        'skor_sentimen',
        'sentimen_terverifikasi',
        'butuh_tinjauan_manual',
    ];

    public function user() : BelongsTo {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function targetUlasan() : BelongsTo {
        return $this->belongsTo(TargetUlasan::class, 'target_ulasan_id');
    }
}
