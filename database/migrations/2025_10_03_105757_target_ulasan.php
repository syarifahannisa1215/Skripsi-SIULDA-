<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('target_ulasan', function (Blueprint $table) {
            $table->id();
            $table->string('tipe')->index();
            $table->string('nama');
            $table->text('deskripsi')->nullable();
            $table->json('metadata')->nullable();
            $table->boolean('is_active')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('target_ulasan');
    }
};
