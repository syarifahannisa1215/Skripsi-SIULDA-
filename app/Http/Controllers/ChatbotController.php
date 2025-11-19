<?php

namespace App\Http\Controllers;

use App\Models\Ulasan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Gemini;
use Throwable;

class ChatbotController extends Controller
{
    /**
     * Handle the incoming chat message from the admin.
     */
    public function handle(Request $request)
    {
        $validated = $request->validate([
            'message' => 'required|string|min:1|max:500',
        ]);

        $userQuestion = $validated['message'];

        try {
            $apiKey = env('GEMINI_API_KEY');
            if (empty($apiKey)) {
                throw new \Exception('GEMINI_API_KEY is not set in .env file.');
            }

            $client = Gemini::client($apiKey);
            $context = $this->gatherDataContext();
            $systemPrompt = $this->createSystemPrompt();
            $finalPrompt = $this->buildFinalPrompt($systemPrompt, $userQuestion, $context);
            $response = $client->generativeModel(model: 'gemini-2.5-flash-preview-09-2025')
                ->generateContent($finalPrompt);
            return response()->json(['reply' => $response->text()]);

        } catch (Throwable $e) {
            report($e);
            return response()->json(['reply' => 'Maaf, terjadi kesalahan pada sistem AI kami. Silakan coba lagi nanti.'], 500);
        }
    }

    /**
     * Creates the new system prompt for the AI Data Analyst.
     */
    private function createSystemPrompt(): string
    {
        return "Anda adalah 'Asisten Analis SIULDA', seorang AI companion yang cerdas untuk admin Dinas Pendidikan Dayah Aceh.
        Tugas Anda adalah membantu admin menganalisis data ulasan, memberikan wawasan (insights), dan menyarankan tindakan untuk 'Peningkatan Layanan Sistem Ulasan Dinas Pendidikan Dayah'.

        PERATURAN PENTING:
        1.  Sapa pengguna (admin) dengan ramah dan profesional (misalnya 'Halo!', 'Tentu, saya periksa datanya.').
        2.  Jawablah dalam Bahasa Indonesia yang profesional, sopan, dan analitikal.
        3.  JAWABAN ANDA HARUS SELALU BERDASARKAN data ringkasan di bagian '--- KONTEKS DATA SAAT INI ---'.
        4.  Gunakan data tersebut untuk menjawab pertanyaan seperti 'bagaimana performa kita?' atau 'apa yang harus saya perbaiki?'.
        5.  Jika data menunjukkan 'rating_rata_rata' rendah atau 'sentimen_negatif' tinggi, berikan sugesti (misalnya 'Rating kita di 2.8, ini area yang perlu diperhatikan. Coba fokus pada target yang paling banyak dikeluhkan.').
        6.  Jika pengguna bertanya di luar konteks data (misalnya 'siapa presiden indonesia?'), jawab dengan sopan: 'Maaf, saya hanya dapat membantu dengan pertanyaan terkait analisis data ulasan di sistem SIULDA.'";
    }

    /**
     * Gathers real-time statistics from the database to be used as context.
     */
    private function gatherDataContext(): string
    {
        // 1. Statistik Utama
        $stats = Ulasan::query()
            ->selectRaw("
                COUNT(*) as total_ulasan,
                AVG(rating) as rating_rata_rata,
                SUM(CASE WHEN sentimen_prediksi = 'positif' THEN 1 ELSE 0 END) as sentimen_positif,
                SUM(CASE WHEN sentimen_prediksi = 'negatif' THEN 1 ELSE 0 END) as sentimen_negatif,
                SUM(CASE WHEN sentimen_terverifikasi IS NULL AND butuh_tinjauan_manual = 1 THEN 1 ELSE 0 END) as butuh_verifikasi
            ")
            ->first();

        // 2. Target yang paling banyak dikeluhkan (Top 3)
        $targetPopulerNegatif = DB::table('ulasan')
            ->join('target_ulasan', 'ulasan.target_ulasan_id', '=', 'target_ulasan.id')
            ->where('ulasan.sentimen_prediksi', 'negatif')
            ->select('target_ulasan.nama', DB::raw('count(*) as total'))
            ->groupBy('target_ulasan.id', 'target_ulasan.nama')
            ->orderBy('total', 'desc')
            ->limit(3)
            ->get();

        // 3. Menyusun string konteks untuk dikirim ke AI
        $contextString = "Total Ulasan: " . $stats->total_ulasan . "\n";
        $contextString .= "Rating Rata-rata: " . round($stats->rating_rata_rata, 1) . " dari 5\n";
        $contextString .= "Total Ulasan Positif: " . $stats->sentimen_positif . "\n";
        $contextString .= "Total Ulasan Negatif: " . $stats->sentimen_negatif . "\n";
        $contextString .= "Ulasan Menunggu Verifikasi Manual: " . $stats->butuh_verifikasi . "\n";

        if ($targetPopulerNegatif->isNotEmpty()) {
            $contextString .= "Target yang paling banyak dikeluhkan (Top 3):\n";
            foreach ($targetPopulerNegatif as $index => $target) {
                $contextString .= ($index + 1) . ". " . $target->nama . " (" . $target->total . " ulasan negatif)\n";
            }
        } else {
            $contextString .= "Saat ini tidak ada target yang memiliki keluhan menonjol.\n";
        }

        return $contextString;
    }

    /**
     * Builds the final string to send to the Gemini API.
     */
    private function buildFinalPrompt(string $systemPrompt, string $userQuestion, string $context): string
    {
        return $systemPrompt . "\n\n" .
            "--- KONTEKS DATA SAAT INI (Gunakan data ini untuk menjawab) ---\n" . $context . "\n" .
            "--- PERTANYAAN ADMIN ---\n" . $userQuestion . "\n\n" .
            "--- JAWABAN ANALITIS ANDA ---:\n";
    }
}
