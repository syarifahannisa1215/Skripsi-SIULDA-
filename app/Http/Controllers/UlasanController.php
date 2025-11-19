<?php

namespace App\Http\Controllers;

use App\Models\Ulasan;
use App\Models\TargetUlasan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use App\Jobs\AnalyzeUlasanSentiment;
use Exception;

class UlasanController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        if (!Auth::check()) {
            return back()->with('error', 'Anda harus masuk untuk memberikan ulasan.');
        }

        $validated = $request->validate([
            'target_ulasan_id' => ['required', 'integer', 'exists:target_ulasan,id'],
            'konten' => ['required', 'string', 'min:10', 'max:5000'],
            'rating' => ['nullable', 'integer', 'min:1', 'max:5'],
        ]);

        try {
            DB::beginTransaction();

            $target = TargetUlasan::findOrFail($validated['target_ulasan_id']);
            if (!$target->is_active) {
                return back()->with('error', 'Target ulasan tidak aktif.');
            }

            $ulasan = Ulasan::create([
                'user_id' => Auth::id(),
                'target_ulasan_id' => $validated['target_ulasan_id'],
                'konten' => $validated['konten'],
                'rating' => $validated['rating'] ?? null,
                'visibilitas' => 'dipublikasikan',
            ]);
            DB::commit();

            // AnalyzeUlasanSentiment::dispatch($ulasan);

            return back()->with('flash.success', 'Terima kasih! Ulasan Anda telah berhasil dikirim.');

        } catch (Exception $e) {
            DB::rollBack();
//            Log::error('Error creating review: ' . $e->getMessage());
            return back()->with('error', 'Terjadi kesalahan saat menyimpan ulasan. Silakan coba lagi.')
                         ->withInput();
        }
    }
}
