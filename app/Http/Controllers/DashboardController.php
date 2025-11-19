<?php

namespace App\Http\Controllers;

use App\Models\Ulasan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Menampilkan dasbor admin dengan data analitik yang teragregasi.
     */
    public function index(): Response
    {
        $rawStats = Ulasan::query()
            ->selectRaw("
                COUNT(*) as total_ulasan,
                AVG(rating) as rating_rata_rata,
                SUM(CASE WHEN sentimen_prediksi = 'positif' THEN 1 ELSE 0 END) as count_positif,
                SUM(CASE WHEN sentimen_prediksi = 'negatif' THEN 1 ELSE 0 END) as count_negatif
            ")
            ->first();

        $totalUlasan = $rawStats->total_ulasan ?? 0;
        $sentimenPositifPercentage = ($totalUlasan > 0) ? ($rawStats->count_positif / $totalUlasan) * 100 : 0;
        $sentimenNegatifPercentage = ($totalUlasan > 0) ? ($rawStats->count_negatif / $totalUlasan) * 100 : 0;

        $stats = [
            'totalUlasan' => (int)$totalUlasan,
            'ratingRataRata' => round($rawStats->rating_rata_rata ?? 0, 1),
            'sentimenPositif' => round($sentimenPositifPercentage),
            'sentimenNegatif' => round($sentimenNegatifPercentage),
        ];

         $daysToFetch = 90;
        $sentimentQueryData = Ulasan::query()
            ->selectRaw("
                DATE(created_at) as tanggal,
                SUM(CASE WHEN sentimen_prediksi = 'positif' THEN 1 ELSE 0 END) as positif,
                SUM(CASE WHEN sentimen_prediksi = 'negatif' THEN 1 ELSE 0 END) as negatif
            ")
            ->where('created_at', '>=', now()->subDays($daysToFetch - 1))
            ->groupBy('tanggal')
            ->orderBy('tanggal', 'asc')
            ->get();

        $sentimentChartData = collect(range(0, $daysToFetch - 1))->map(function ($day) use ($sentimentQueryData) {
            $date = now()->subDays($day);
            $dateString = $date->format('Y-m-d');
            $record = $sentimentQueryData->firstWhere('tanggal', $dateString);
            return [
                'date' => $dateString,
                'positif' => $record ? (int)$record->positif : 0,
                'negatif' => $record ? (int)$record->negatif : 0,
            ];
        })->reverse()->values();

        $ulasanTerbaru = Ulasan::with(['user:id,name,avatar', 'targetUlasan:id,nama,tipe'])
            ->latest()
            ->limit(5)
            ->get();

        $targetPopuler = DB::table('ulasan')
            ->join('target_ulasan', 'ulasan.target_ulasan_id', '=', 'target_ulasan.id')
            ->select('target_ulasan.nama', 'target_ulasan.tipe', DB::raw('count(*) as total'))
            ->groupBy('target_ulasan.id', 'target_ulasan.nama', 'target_ulasan.tipe')
            ->orderBy('total', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'sentimentChartData' => $sentimentChartData,
            'ulasanTerbaru' => $ulasanTerbaru,
            'targetPopuler' => $targetPopuler,
        ]);
    }
}
