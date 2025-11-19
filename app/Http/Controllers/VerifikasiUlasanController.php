<?php

namespace App\Http\Controllers;

use App\Models\Ulasan;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class VerifikasiUlasanController extends Controller
{
    public function index(): Response
{
    $ulasanUntukVerifikasi = Ulasan::with(['user', 'targetUlasan'])
        ->where('butuh_tinjauan_manual', true)
        ->whereNull('sentimen_terverifikasi')
        ->orderBy('skor_sentimen', 'asc')
        ->paginate(15);

    return Inertia::render('Dashboard/VerifikasiUlasan', [
        'ulasanList' => $ulasanUntukVerifikasi,
    ]);
}

    public function update(Request $request, Ulasan $ulasan): RedirectResponse
    {
        $validated = $request->validate([
            'sentiment' => ['required', Rule::in(['positif', 'negatif', 'netral'])],
        ]);

        $ulasan->sentimen_terverifikasi = $validated['sentiment'];
        $ulasan->save();

        return back()->with('flash.success', 'Sentimen berhasil diverifikasi!');
    }
}