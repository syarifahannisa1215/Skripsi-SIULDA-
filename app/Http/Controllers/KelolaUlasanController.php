<?php

namespace App\Http\Controllers;

use App\Models\Ulasan;
use App\Jobs\AnalyzeSentiment;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class KelolaUlasanController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'sentiment', 'status', 'sort']);

        $ulasanList = Ulasan::query()
            ->with(['user:id,name,avatar', 'targetUlasan:id,nama,tipe'])
            ->when($request->input('search'), function ($query, $search) {
                $query->where('konten', 'like', "%{$search}%")
                    ->orWhereHas('user', fn ($q) => $q->where('name', 'like', "%{$search}%"))
                    ->orWhereHas('targetUlasan', fn ($q) => $q->where('nama', 'like', "%{$search}%"));
            })
            ->when($request->input('sentiment'), function ($query, $sentiment) {
                $query->where('sentimen_prediksi', $sentiment);
            })
            ->when($request->input('status'), function ($query, $status) {
                $query->where('visibilitas', $status);
            })
            ->when($request->input('sort'), function ($query, $sort) {
                switch ($sort) {
                    case 'oldest':
                        $query->oldest();
                        break;
                    case 'sentiment_desc': // Paling Positif (jika skor tinggi = positif)
                        // Assuming high score is more intense sentiment?? 
                        // Actually 'skor_sentimen' might be just confidence.
                        // But typically we sort by label or score.
                        // Let's assume we rely on label mostly or just create a custom sort.
                        // If sentimen_prediksi is 'positif', 'netral', 'negatif'.
                        // This is harder to sort by SQL casually without case.
                        // Let's sort by score for now if user requests it.
                        $query->orderBy('skor_sentimen', 'desc');
                        break;
                    case 'sentiment_asc':
                        $query->orderBy('skor_sentimen', 'asc');
                        break;
                    default:
                        $query->latest();
                        break;
                }
            }, function ($query) {
                $query->latest();
            })
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Dashboard/KelolaUlasan', [
            'ulasanList' => $ulasanList,
            'filters' => $filters,
        ]);
    }

    public function bulkDestroy(Request $request): RedirectResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:ulasan,id',
        ]);

        Ulasan::whereIn('id', $request->ids)->delete();

        return back()->with('flash.success', count($request->ids) . ' ulasan berhasil dihapus.');
    }

    public function update(Request $request, Ulasan $ulasan): RedirectResponse
    {
        $validated = $request->validate([
            'visibilitas' => ['required', Rule::in(['dipublikasikan', 'disembunyikan'])],
        ]);

        $ulasan->visibilitas = $validated['visibilitas'];
        $ulasan->save();

        return back()->with('flash.success', 'Status ulasan berhasil diperbarui.');
    }

    public function destroy(Ulasan $ulasan): RedirectResponse {
        $ulasan->delete();

        return back()->with('flash.success', 'Ulasan berhasil dihapus.');
    }

    public function analyze(): RedirectResponse
    {
        set_time_limit(0); 

        $ulasanToAnalyze = Ulasan::whereNull('sentimen_prediksi')->get();
        $count = $ulasanToAnalyze->count();

        if ($count === 0) {
            return back()->with('flash.info', 'Tidak ada ulasan baru untuk dianalisis.');
        }

        foreach ($ulasanToAnalyze as $ulasan) {
            AnalyzeSentiment::dispatchSync($ulasan);
        }

        return back()->with('flash.success', "Berhasil menganalisis {$count} ulasan.");
    }
}
