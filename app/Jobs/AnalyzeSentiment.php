<?php

namespace App\Jobs;

use App\Models\Ulasan;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AnalyzeSentiment implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private const MODEL_URL = 'https://router.huggingface.co/hf-inference/models/mdhugol/indonesia-bert-sentiment-classification';
    private const CONFIDENCE_THRESHOLD = 0.70;

    private const LABEL_MAPPING = [
        'LABEL_0' => 'positif',
        'LABEL_1' => 'neutral',
        'LABEL_2' => 'negatif',
    ];

    public function __construct(
        public Ulasan $ulasan
    ) {}

    public function handle(): void
    {
        $apiToken = config('services.huggingface.token');

        if (empty($apiToken)) {
            Log::error('Hugging Face API token tidak ditemukan.');
            return;
        }

        try {
            $response = Http::withToken($apiToken)
                ->timeout(30)
                ->post(self::MODEL_URL, [
                    'inputs' => $this->ulasan->konten,
                ]);

            if ($response->successful()) {
                $result = $response->json();

                $predictions = $result[0] ?? [];
                usort($predictions, fn($a, $b) => $b['score'] <=> $a['score']);
                $topPrediction = $predictions[0] ?? null;

                if ($topPrediction && isset($topPrediction['label'], $topPrediction['score'])) {
                    $raw_label = $topPrediction['label'];
                    $confidence_score = $topPrediction['score'];

                    if (array_key_exists($raw_label, self::LABEL_MAPPING)) {
                        $sentiment = self::LABEL_MAPPING[$raw_label];
                        $this->ulasan->sentimen_prediksi = $sentiment;
                        $this->ulasan->skor_sentimen = $confidence_score;
                        if ($confidence_score >= self::CONFIDENCE_THRESHOLD) {
                            $this->ulasan->sentimen_terverifikasi = $sentiment;
                            $this->ulasan->butuh_tinjauan_manual = false;
                            Log::info('Analisis berhasil & AUTO-VERIFIED untuk ulasan ID: ' . $this->ulasan->id);
                        } else {
                            $this->ulasan->sentimen_terverifikasi = null;
                            $this->ulasan->butuh_tinjauan_manual = true;
                            Log::info('Analisis berhasil, BUTUH VERIFIKASI MANUAL untuk ulasan ID: ' . $this->ulasan->id);
                        }

                        $this->ulasan->save();

                    } else {
                         Log::warning('Label mentah tidak dikenal dari API', ['label' => $raw_label]);
                    }
                } else {
                    Log::error('Respons dari API Router tidak valid.', ['response' => $response->body()]);
                }
            } else {
                Log::error('API Router gagal.', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Gagal terhubung ke API Router.', [
                'error' => $e->getMessage(),
            ]);
        }
    }
}
