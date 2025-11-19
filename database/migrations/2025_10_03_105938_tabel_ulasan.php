<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ulasan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('target_ulasan_id')->constrained('target_ulasan')->onDelete('cascade');
            $table->text('konten');
            $table->unsignedTinyInteger('rating')->nullable(); 
            $table->enum('visibilitas', ['dipublikasikan', 'disembunyikan'])->default('dipublikasikan');
            $table->enum('sentimen_prediksi', ['positif', 'negatif', 'netral'])->nullable();
            $table->decimal('skor_sentimen', 3, 2)->nullable();
            $table->enum('sentimen_terverifikasi', ['positif', 'negatif', 'netral'])->nullable();
            $table->boolean('butuh_tinjauan_manual')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ulasan');
    }
};