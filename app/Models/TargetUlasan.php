<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TargetUlasan extends Model
{   
    use HasFactory;
    protected $table = "target_ulasan";

    protected $fillable = 
    [
        'tipe',
        'nama',
        'deskripsi',
        'metadata',
        'is_active'
    ];

    protected $casts = [
        'metadata'=> 'array',
        'is_active'=> 'boolean',
    ];

    public function ulasan(): HasMany
    {
        return $this->hasMany(Ulasan::class);
    }

    
}
