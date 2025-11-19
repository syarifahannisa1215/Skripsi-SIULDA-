<?php

namespace App\Console\Commands;

use App\Jobs\AnalyzeSentiment;
use App\Models\Ulasan;
use Illuminate\Console\Command;

class AnalyzeUlasan extends Command
{
    protected $signature = 'ulasan:analyze-existing';
    protected $description = 'Menganalisis sentimen untuk semua ulasan yang belum memiliki data sentimen.';
    public function handle()
    {
        $this->info('Memulai proses analisis ulasan yang sudah ada...');

        $ulasanToAnalyze = Ulasan::whereNull('sentimen_prediksi')->get();

        if ($ulasanToAnalyze->isEmpty()) {
            $this->info('Tidak ada ulasan baru untuk dianalisis. Semua sudah up-to-date!');
            return 0;
        }

        $count = $ulasanToAnalyze->count();
        $this->info("Ditemukan {$count} ulasan yang akan dianalisis.");

        $bar = $this->output->createProgressBar($count);
        $bar->start();

        foreach ($ulasanToAnalyze as $ulasan) {
            AnalyzeSentiment::dispatch($ulasan);
            $bar->advance();
        }

        $bar->finish();
        $this->info("\n\nBerhasil mengirim {$count} ulasan ke antrean untuk dianalisis.");
        $this->comment('Pastikan queue worker Anda sedang berjalan untuk memprosesnya: php artisan queue:work');
        
        return 0; 
    }
}